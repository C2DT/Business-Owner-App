# IBO App v5.3.6 — Calendar Booking Button Response Fix

## What's changed
- The PIP/Outreach Scheduler's Book on Calendar button now calls the booking handler explicitly through `window`.
- Added a click bridge that immediately displays a booking status, prevents accidental double-clicks while the request is running, and surfaces JavaScript errors in the appointment status area.
- Preserves the existing `pipBookNextStep`, secure Supabase Google Calendar Edge Function, calendar-access checks, appointment save logic, and `.ics` fallback.
- All app version labels updated to v5.3.6.
- Service-worker cache updated.

## Publishing
Extract the ZIP and upload all files to the GitHub repository root, replacing the existing files, then commit to `main`.

No new SQL is required.

## Test
Open an In the Process contact, open Book Next Step, select date/time and facilitator, then tap Book on Calendar. The status line should immediately change to "Starting calendar booking…" and then show progress or a specific error. If it errors, share the exact message so the remaining calendar issue can be diagnosed.
