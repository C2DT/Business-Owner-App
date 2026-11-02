# IBO App v5.3.9 — Calendar Reliability Fix

## Why the buttons looked like they did nothing
The v5.3.8 click handlers did run. The result was lost because of a conflict with cloud sync:

1. Book on Calendar refreshed the Supabase sign-in token on every click and wrote it to storage.
2. The cloud-sync script treats any write of the session as a new login. About 300 ms later it re-pulled data and
   **re-rendered the whole In the Process list** (`iboReloadPIPState` -> `pipRenderList`).
3. The booking request (several network calls plus Google) takes seconds, so the screen was rebuilt mid-request. The
   scheduling panel closed and the status element the code was writing to was removed from the page. The final
   SUCCESS or ERROR text went to a detached element, so nothing appeared.
4. The Google event ID was also saved onto a stale in-memory copy and never persisted, so a retry could create duplicates.

## What changed
- List re-renders and state reloads are paused while a calendar action is running.
- Every status or error is written to the panel AND to a banner pinned to the bottom of the screen that survives re-renders.
- Errors name the step that failed (for example "BOOKING ERROR while calling the booking service: ...").
- All network calls have timeouts, so a hung request now ends in a message instead of staying on "Creating meeting...".
- The backend's own error text (error / message / msg) and HTTP status are shown. Network failures explain the likely CORS/URL cause.
- The sign-in token is refreshed only when it is missing or about to expire.
- The booked event ID is saved against the current stored copy of the prospect.
- Export Calendar Invite: on iPhone/iPad it opens the share sheet (blob downloads are ignored in the installed home-screen app);
  elsewhere it downloads the .ics. A tappable "Open in Google Calendar instead" link is always shown as a fallback.
- sw.js: network-first for the app page (no more stale index.html), install bypasses the HTTP cache, and Supabase/Google
  requests are never intercepted. Cache name: business-owner-v5-3-9-calendar-reliability.

## Publishing
Upload all files to the GitHub repository root, replacing the existing ones. Fully close and reopen the installed app twice
(first launch installs the new service worker, second launch runs it). The version label should read v5.3.9.

## Not changed (cannot be verified from this ZIP)
The Supabase Edge Function `Google-calendar` (routes /book, /status, /connect), its CORS handling, the Google OAuth
credentials, and facilitator approval records. If the banner reports an error after the booking service is called, that
message is coming from the backend.
