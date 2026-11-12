
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SECRET_KEY = Deno.env.get("SB_SECRET_KEY")!;
const GOOGLE_ID = Deno.env.get("Google_Client_ID")!;
const GOOGLE_SECRET = Deno.env.get("Google_Client_Secret")!;
const ENCRYPTION_HEX = Deno.env.get("GOOGLE_TOKEN_ENCRYPTION_KEY")!;

const CALLBACK = `${SUPABASE_URL}/functions/v1/Google-calendar/callback`;
const APP_URL = "https://c2dt.github.io/Business-Owner-App/";
const APP_ORIGIN = "https://c2dt.github.io";

const db = createClient(SUPABASE_URL, SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const cors = {
  "Access-Control-Allow-Origin": APP_ORIGIN,
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function page(message: string, status = 200) {
  const succeeded =
    status < 400 && /connected successfully/i.test(message);

  const destination = succeeded
    ? `${APP_URL}?google_calendar=connected`
    : `${APP_URL}?google_calendar=error`;

  return new Response(null, {
    status: 302,
    headers: {
      "Location": destination,
      "Cache-Control": "no-store",
    },
  });
}

function hexBytes(hex: string) {
  if (!/^[0-9a-f]{64}$/i.test(hex)) {
    throw new Error("Encryption key must be 64 hexadecimal characters.");
  }

  return new Uint8Array(
    hex.match(/.{2}/g)!.map((x) => parseInt(x, 16)),
  );
}

function toB64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromB64(value: string) {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}

async function cryptoKey() {
  return crypto.subtle.importKey(
    "raw",
    hexBytes(ENCRYPTION_HEX),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encrypt(value: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await cryptoKey(),
    new TextEncoder().encode(value),
  );

  return `${toB64(iv)}.${toB64(new Uint8Array(ciphertext))}`;
}

async function decrypt(value: string) {
  const [iv, ciphertext] = value.split(".");

  if (!iv || !ciphertext) {
    throw new Error("Invalid encrypted token.");
  }

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromB64(iv) },
    await cryptoKey(),
    fromB64(ciphertext),
  );

  return new TextDecoder().decode(plaintext);
}

async function hash(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );

  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getUser(req: Request) {
  const header = req.headers.get("Authorization") ?? "";

  if (!header.startsWith("Bearer ")) return null;

  const token = header.slice(7);
  if (!token) return null;

  const { data, error } = await db.auth.getUser(token);

  if (error || !data.user) return null;

  return data.user;
}

async function readBody(req: Request) {
  try {
    return await req.json();
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

async function googleTokenRequest(params: URLSearchParams) {
  const response = await fetch(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "Google token endpoint error:",
      response.status,
    );

    throw new Error("Google authorization or token refresh failed.");
  }

  return data;
}

async function connect(req: Request) {
  const user = await getUser(req);

  if (!user) {
    return json(
      { error: "Please sign in to IBO App again." },
      401,
    );
  }

  const state = toB64(
    crypto.getRandomValues(new Uint8Array(32)),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const stateHash = await hash(state);

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000,
  ).toISOString();

  const { error } = await db
    .from("google_calendar_oauth_states")
    .insert({
      state_hash: stateHash,
      user_id: user.id,
      expires_at: expiresAt,
    });

  if (error) {
    console.error(
      "OAuth state insert failed:",
      error.message,
    );

    return json(
      { error: "Could not start Google Calendar connection." },
      500,
    );
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_ID,
    redirect_uri: CALLBACK,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    scope: [
      "openid",
      "email",
      "https://www.googleapis.com/auth/calendar.events.owned",
    ].join(" "),
    state,
  });

  return json({
    authorization_url:
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  });
}

async function callback(req: Request) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const googleError = url.searchParams.get("error");

  if (googleError) {
    return page(
      "Google Calendar connection was cancelled.",
      400,
    );
  }

  if (!code || !state) {
    return page(
      "Missing Google authorization details.",
      400,
    );
  }

  const stateHash = await hash(state);

  const { data: stateRow, error: stateError } = await db
    .from("google_calendar_oauth_states")
    .select("user_id, expires_at")
    .eq("state_hash", stateHash)
    .maybeSingle();

  if (stateError || !stateRow) {
    return page(
      "This authorization link has expired. Please reconnect from IBO App.",
      400,
    );
  }

  const { error: deleteError } = await db
    .from("google_calendar_oauth_states")
    .delete()
    .eq("state_hash", stateHash);

  if (deleteError) {
    console.error(
      "OAuth state consume failed:",
      deleteError.message,
    );

    return page(
      "Could not verify the authorization request. Please try again.",
      500,
    );
  }

  if (
    new Date(stateRow.expires_at).getTime() < Date.now()
  ) {
    return page(
      "This authorization link has expired. Please reconnect from IBO App.",
      400,
    );
  }

  const tokens = await googleTokenRequest(
    new URLSearchParams({
      code,
      client_id: GOOGLE_ID,
      client_secret: GOOGLE_SECRET,
      redirect_uri: CALLBACK,
      grant_type: "authorization_code",
    }),
  );

  if (!tokens.access_token) {
    return page(
      "Google did not return an access token. Please reconnect.",
      400,
    );
  }

  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    },
  );

  if (!userInfoResponse.ok) {
    return page(
      "Google authorization succeeded, but the account email could not be read.",
      400,
    );
  }

  const googleUser = await userInfoResponse.json();

  const { data: existing } = await db
    .from("google_calendar_connections")
    .select("encrypted_refresh_token")
    .eq("user_id", stateRow.user_id)
    .maybeSingle();

  const refreshToken = tokens.refresh_token
    ? await encrypt(tokens.refresh_token)
    : existing?.encrypted_refresh_token;

  if (!refreshToken) {
    return page(
      "Google did not provide a refresh token. Reconnect and approve access when prompted.",
      400,
    );
  }

  const now = new Date().toISOString();

  const expiresAt = new Date(
    Date.now() + Number(tokens.expires_in ?? 3600) * 1000,
  ).toISOString();

  const { error: saveError } = await db
    .from("google_calendar_connections")
    .upsert(
      {
        user_id: stateRow.user_id,
        encrypted_access_token: await encrypt(tokens.access_token),
        encrypted_refresh_token: refreshToken,
        token_expires_at: expiresAt,
        connected_email: googleUser.email ?? null,
        granted_scope: tokens.scope ?? null,
        updated_at: now,
      },
      { onConflict: "user_id" },
    );

  if (saveError) {
    console.error(
      "Saving Google connection failed:",
      saveError.message,
    );

    return page(
      "Google authorized, but saving the connection failed. Please try again.",
      500,
    );
  }

  return page("Google Calendar connected successfully.");
}

async function calendarStatus(req: Request) {
  const user = await getUser(req);

  if (!user) {
    return json(
      {
        error: "Please sign in again.",
        connected: false,
      },
      401,
    );
  }

  const { data, error } = await db
    .from("google_calendar_connections")
    .select("connected_email, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Calendar status query failed:",
      error.message,
    );

    return json(
      { error: "Could not check Google Calendar status." },
      500,
    );
  }

  return json({
    connected: Boolean(data),
    connected_email: data?.connected_email ?? null,
    updated_at: data?.updated_at ?? null,
  });
}

async function getValidAccessToken(uplineUserId: string) {
  const { data: connection, error } = await db
    .from("google_calendar_connections")
    .select("*")
    .eq("user_id", uplineUserId)
    .maybeSingle();

  if (error || !connection) {
    throw new Error(
      "The selected facilitator has not connected Google Calendar.",
    );
  }

  const expiresAt = connection.token_expires_at
    ? new Date(connection.token_expires_at).getTime()
    : 0;

  if (expiresAt > Date.now() + 60_000) {
    return await decrypt(connection.encrypted_access_token);
  }

  const refreshToken = await decrypt(
    connection.encrypted_refresh_token,
  );

  const tokens = await googleTokenRequest(
    new URLSearchParams({
      client_id: GOOGLE_ID,
      client_secret: GOOGLE_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  );

  if (!tokens.access_token) {
    throw new Error("Google did not return a refreshed access token.");
  }

  const newExpiry = new Date(
    Date.now() + Number(tokens.expires_in ?? 3600) * 1000,
  ).toISOString();

  const { error: updateError } = await db
    .from("google_calendar_connections")
    .update({
      encrypted_access_token: await encrypt(tokens.access_token),
      token_expires_at: newExpiry,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", uplineUserId);

  if (updateError) {
    console.error(
      "Updating refreshed token failed:",
      updateError.message,
    );

    throw new Error("Could not save the refreshed Google token.");
  }

  return tokens.access_token as string;
}


// Resolve the signed-in user's active sponsor chain and the active partners
// of those upline members. This deliberately does not inspect shared calendars.
async function getAuthorizedTeamPeople(requesterId: string): Promise<Set<string>> {
  const people = new Set<string>([requesterId]);
  let currentId = requesterId;

  for (let level = 0; level < 50; level++) {
    const { data, error } = await db
      .from("sponsor_relationships")
      .select("sponsor_user_id")
      .eq("user_id", currentId)
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      console.error("Sponsor-chain lookup failed:", error.message);
      throw new Error("Could not verify your active upline.");
    }

    const sponsorId = data?.sponsor_user_id as string | undefined;
    if (!sponsorId) break;
    if (people.has(sponsorId)) {
      throw new Error("A cycle was found in the active sponsor chain.");
    }
    people.add(sponsorId);
    currentId = sponsorId;
  }

  const uplineIds = [...people].filter((id) => id !== requesterId);
  if (!uplineIds.length) return people;

  const { data: memberships, error: membershipError } = await db
    .from("business_partnership_members")
    .select("partnership_id")
    .in("user_id", uplineIds)
    .eq("membership_status", "active");

  if (membershipError) {
    console.error("Partnership lookup failed:", membershipError.message);
    throw new Error("Could not verify active upline partnerships.");
  }

  const partnershipIds = [...new Set(
    (memberships ?? []).map((row: any) => row.partnership_id).filter(Boolean),
  )];

  if (!partnershipIds.length) return people;

  const { data: partnerships, error: partnershipError } = await db
    .from("business_partnerships")
    .select("id")
    .in("id", partnershipIds)
    .eq("status", "active");

  if (partnershipError) {
    console.error("Active partnership check failed:", partnershipError.message);
    throw new Error("Could not verify active upline partnerships.");
  }

  const activePartnershipIds = (partnerships ?? []).map((row: any) => row.id);
  if (!activePartnershipIds.length) return people;

  const { data: partners, error: partnersError } = await db
    .from("business_partnership_members")
    .select("user_id")
    .in("partnership_id", activePartnershipIds)
    .eq("membership_status", "active");

  if (partnersError) {
    console.error("Partner member lookup failed:", partnersError.message);
    throw new Error("Could not verify active upline partners.");
  }

  for (const row of partners ?? []) {
    if (row.user_id) people.add(row.user_id);
  }

  return people;
}

async function latestRecipientStatuses(requesterId: string) {
  const { data: requests, error: requestsError } = await db
    .from("calendar_access_requests")
    .select("id, created_at")
    .eq("requester_user_id", requesterId)
    .order("created_at", { ascending: false });

  if (requestsError) {
    console.error("Calendar access request lookup failed:", requestsError.message);
    throw new Error("Could not check calendar access requests.");
  }

  if (!requests?.length) return new Map<string, any>();

  const requestIds = requests.map((row: any) => row.id);
  const requestDates = new Map<string, number>(
    requests.map((row: any) => [
      String(row.id),
      new Date(row.created_at).getTime(),
    ] as [string, number]),
  );

  const { data: recipients, error: recipientsError } = await db
    .from("calendar_access_request_recipients")
    .select("id, request_id, upline_user_id, status, created_at, responded_at")
    .in("request_id", requestIds);

  if (recipientsError) {
    console.error("Calendar recipient lookup failed:", recipientsError.message);
    throw new Error("Could not check calendar access approvals.");
  }

  const sorted = (recipients ?? []).slice().sort((a: any, b: any) => {
    const requestDelta =
      (requestDates.get(b.request_id) ?? 0) -
      (requestDates.get(a.request_id) ?? 0);
    if (requestDelta) return requestDelta;
    return new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime();
  });

  const latest = new Map<string, any>();
  for (const row of sorted) {
    if (!latest.has(row.upline_user_id)) latest.set(row.upline_user_id, row);
  }
  return latest;
}

async function hasApprovedCalendarAccess(
  requesterId: string,
  calendarOwnerId: string,
): Promise<boolean> {
  const latest = await latestRecipientStatuses(requesterId);
  return latest.get(calendarOwnerId)?.status === "approved";
}

async function approvedUplines(req: Request) {
  const user = await getUser(req);
  if (!user) return json({ error: "Please sign in again." }, 401);

  const [latest, authorizedPeople] = await Promise.all([
    latestRecipientStatuses(user.id),
    getAuthorizedTeamPeople(user.id),
  ]);

  const approvedIds = [...latest.entries()]
    .filter(([personId, row]) =>
      row.status === "approved" && authorizedPeople.has(personId)
    )
    .map(([personId]) => personId);

  if (!approvedIds.length) return json({ calendars: [] });

  const { data: connections, error: connectionError } = await db
    .from("google_calendar_connections")
    .select("user_id, connected_email, updated_at")
    .in("user_id", approvedIds);

  if (connectionError) {
    console.error("Approved calendar connection lookup failed:", connectionError.message);
    return json({ error: "Could not load approved upline calendars." }, 500);
  }

  const connectedIds = (connections ?? []).map((row: any) => row.user_id);
  if (!connectedIds.length) return json({ calendars: [] });

  const { data: profiles, error: profilesError } = await db
    .from("profiles")
    .select("user_id, first_name, last_name, display_name")
    .in("user_id", connectedIds);

  if (profilesError) {
    console.error("Calendar owner profile lookup failed:", profilesError.message);
    return json({ error: "Could not load calendar owner names." }, 500);
  }

  const profileMap = new Map(
    (profiles ?? []).map((row: any) => [row.user_id, row]),
  );

  const calendars = (connections ?? []).map((connection: any) => {
    const profile: any = profileMap.get(connection.user_id) ?? {};
    const ownerName = profile.display_name ||
      [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
      "Upline";
    return {
      connection_user_id: connection.user_id,
      owner_name: ownerName,
      connection_email: connection.connected_email ?? null,
      is_own: false,
      calendar_name: `${ownerName}'s primary calendar`,
    };
  });

  return json({ calendars });
}

async function saveBookingRecord(record: Record<string, unknown>) {
  const { error } = await db
    .from("calendar_booking_records")
    .upsert(record, {
      onConflict: "booking_user_id,booking_reference,booking_mode",
    });

  if (error) {
    console.error("Calendar booking statistics could not be saved:", error.message);
    return false;
  }
  return true;
}

function validMeetingTimes(startText: string, endText: string) {
  const start = new Date(startText);
  const end = new Date(endText);
  return {
    start,
    end,
    valid: Number.isFinite(start.getTime()) &&
      Number.isFinite(end.getTime()) &&
      end.getTime() > start.getTime(),
  };
}

async function book(req: Request) {
  const user = await getUser(req);
  if (!user) {
    return json({ error: "Please sign in to IBO App again." }, 401);
  }

  const body = await readBody(req);
  const mode = String(body.booking_mode ?? "");
  const legacyOwnerId = String(body.upline_user_id ?? "");
  const ownerId = String(
    body.calendar_owner_user_id ??
    legacyOwnerId ??
    (mode === "own" ? user.id : ""),
  );
  const facilitatorId = String(body.facilitator_user_id ?? "");
  const facilitatorName = String(body.facilitator_name ?? "").slice(0, 200);
  const startText = String(body.start_time ?? "");
  const endText = String(body.end_time ?? "");
  const summary = String(body.summary ?? "IBO App Meeting").slice(0, 250);
  const description = String(body.description ?? "").slice(0, 8000);
  const bookingMode = mode === "own" || ownerId === user.id ? "own" : "upline";

  if (!ownerId || !startText || !endText) {
    return json({
      error: "Calendar owner, start time, and end time are required.",
    }, 400);
  }

  const times = validMeetingTimes(startText, endText);
  if (!times.valid) {
    return json({ error: "The meeting start or end time is invalid." }, 400);
  }

  let authorizedPeople: Set<string>;
  try {
    authorizedPeople = await getAuthorizedTeamPeople(user.id);
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : "Could not verify team access.",
    }, 500);
  }

  if (bookingMode === "own") {
    if (ownerId !== user.id) {
      return json({ error: "You can only book on your own Google Calendar in this mode." }, 403);
    }
  } else {
    if (!authorizedPeople.has(ownerId)) {
      return json({ error: "The selected calendar owner is not in your active upline or an active upline partnership." }, 403);
    }
    if (!user.email) {
      return json({
        error: "Your IBO App account needs an email address to send the invitation.",
      }, 400);
    }
    const approved = await hasApprovedCalendarAccess(user.id, ownerId);
    if (!approved) {
      return json({ error: "The selected person has not approved your calendar booking access." }, 403);
    }
  }

  if (facilitatorId && !authorizedPeople.has(facilitatorId)) {
    return json({
      error: "The selected facilitator is not in your active upline or an active upline partnership.",
    }, 403);
  }

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(ownerId);
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : "Could not access the selected Google Calendar.",
    }, 400);
  }

  const facilitatorLine = facilitatorName
    ? `\nFacilitator: ${facilitatorName}`
    : "";
  const eventDescription = `${description}${facilitatorLine}`.slice(0, 8000);

  const event: Record<string, unknown> = {
    summary,
    description: eventDescription,
    start: { dateTime: times.start.toISOString() },
    end: { dateTime: times.end.toISOString() },
    extendedProperties: {
      private: {
        ibo_booking_user_id: user.id,
        ibo_calendar_owner_user_id: ownerId,
        ibo_facilitator_user_id: facilitatorId || "",
        ibo_booking_mode: bookingMode,
      },
    },
  };

  if (bookingMode === "upline") {
    event.attendees = [{ email: user.email }];
  }

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    },
  );

  let result: any = {};
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    console.error("Google Calendar event creation failed:", response.status, result?.error?.message ?? "");
    return json({
      error: "Google Calendar could not create the meeting. Check the selected person's Google connection and primary-calendar permissions.",
    }, 502);
  }

  const bookingReference = String(body.booking_reference ?? crypto.randomUUID());
  const statisticsRecorded = await saveBookingRecord({
    booking_user_id: user.id,
    facilitator_user_id: facilitatorId || null,
    facilitator_name: facilitatorName || null,
    calendar_owner_user_id: ownerId,
    booking_reference: bookingReference,
    google_calendar_id: "primary",
    google_event_id: result.id ?? null,
    google_event_link: result.htmlLink ?? null,
    booking_mode: bookingMode,
    prospect_name: String(body.prospect_name ?? summary).slice(0, 250),
    meeting_type: String(body.meeting_type ?? "").slice(0, 100) || null,
    starts_at: times.start.toISOString(),
    ends_at: times.end.toISOString(),
  });

  return json({
    success: true,
    event_id: result.id,
    event_link: result.htmlLink ?? null,
    htmlLink: result.htmlLink ?? null,
    status: "created",
    statistics_recorded: statisticsRecorded,
  });
}

async function recordICS(req: Request) {
  const user = await getUser(req);
  if (!user) return json({ error: "Please sign in again." }, 401);

  const body = await readBody(req);
  const bookingReference = String(body.booking_reference ?? "");
  const startText = String(body.starts_at ?? "");
  const endText = String(body.ends_at ?? "");
  const facilitatorId = String(body.facilitator_user_id ?? "");

  if (!bookingReference || !startText || !endText) {
    return json({ error: "Booking reference and meeting times are required." }, 400);
  }

  const times = validMeetingTimes(startText, endText);
  if (!times.valid) {
    return json({ error: "The meeting start or end time is invalid." }, 400);
  }

  if (facilitatorId) {
    const authorizedPeople = await getAuthorizedTeamPeople(user.id);
    if (!authorizedPeople.has(facilitatorId)) {
      return json({ error: "The selected facilitator is not in your active upline or an active upline partnership." }, 403);
    }
  }

  const recorded = await saveBookingRecord({
    booking_user_id: user.id,
    facilitator_user_id: facilitatorId || null,
    facilitator_name: String(body.facilitator_name ?? "").slice(0, 200) || null,
    calendar_owner_user_id: null,
    booking_reference: bookingReference,
    google_calendar_id: null,
    google_event_id: null,
    google_event_link: null,
    booking_mode: "ics",
    prospect_name: String(body.prospect_name ?? "").slice(0, 250) || null,
    meeting_type: String(body.meeting_type ?? "").slice(0, 100) || null,
    starts_at: times.start.toISOString(),
    ends_at: times.end.toISOString(),
  });

  if (!recorded) return json({ error: "The ICS file was created, but its statistics record could not be saved." }, 500);
  return json({ success: true, statistics_recorded: true });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, "");
  const route = path.split("/").pop() ?? "";

  try {
    if (req.method === "POST" && route === "connect") return await connect(req);
    if (req.method === "GET" && route === "callback") return await callback(req);
    if (req.method === "GET" && route === "status") return await calendarStatus(req);
    if (req.method === "GET" && route === "approved-uplines") return await approvedUplines(req);
    if (req.method === "POST" && route === "book") return await book(req);
    if (req.method === "POST" && route === "record") return await recordICS(req);

    return json({ error: "Route not found." }, 404);
  } catch (error) {
    console.error(
      "Google-calendar request failed:",
      error instanceof Error ? error.message : String(error),
    );
    return json({
      error: error instanceof Error ? error.message : "Unexpected Google Calendar error.",
    }, 500);
  }
});
