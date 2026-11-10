# IBO App v5.3.75 — Individual Calendar Approval Directory Fix

## Design
- Each user connects their own Google account.
- Only that account's primary Google Calendar is used.
- Upline and active spouse/partner people are listed separately.
- Calendar approval is per person.
- Meeting facilitator and calendar owner are separate fields.
- Booking destinations: upline primary calendar, user's own primary calendar, or ICS export.
- The original OAuth callback, encrypted token storage, refresh-token flow, redirect URL, CORS origin, and `calendar.events.owned` scope are preserved from the working function.

## Deployment order
1. In Supabase SQL Editor, run SQL Cell 1, then Cell 2, then Cell 3. Cell 4 is verification only.
2. Deploy `supabase/functions/Google-calendar/index.ts` as the existing function named `Google-calendar`.
3. Replace the GitHub Pages app files with the contents of this ZIP.
4. Reconnect Google only if the existing connection is not working. This version does not request expanded OAuth scopes.

## Important
- Do not deploy the experimental calendar-resource migration from v5.3.73.
- The Edge Function uses each person's primary calendar only. It does not list or synchronize secondary/shared calendars.
- Existing `calendar_access_requests`, `calendar_access_request_recipients`, `respond_to_calendar_access_request`, and `revoke_calendar_access` remain in use.
- The statistics table records booking user, facilitator, calendar owner, booking mode, times, and Google event details. RLS currently permits a user to read records where they are the booking user, facilitator, or calendar owner.
- Run SQL Cell 1 before deploying the Edge Function so booking statistics can be saved.


## v5.3.75 targeted fix
- Request Calendar Access now reads the server-authorized `get_my_team_facilitators()` directory, so active partners of upline members (such as Ashley for Jarrius) appear as individual approval recipients.
- The existing sponsor-only directory remains available for other app features.
- No Google Calendar Edge Function or OAuth behavior was changed.
