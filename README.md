# IBO App v5.3.8 — Direct Calendar Action Binding

## What's changed
- Both **Book on Calendar** and **Export Calendar Invite (.ics)** now use direct click listeners attached when each prospect card is rendered.
- Removed the previous document-level delegated listener for Book on Calendar.
- Removed the inline Export Calendar Invite handler.
- Both actions now display immediate status or a visible failure message in the prospect scheduler.
- Existing appointment saving, Google Calendar booking, Supabase Edge Function, calendar permissions, and invite generation logic are unchanged.
- Updated the app version and service-worker cache.

## Publishing
Upload all files from this ZIP to the GitHub repository root, replace existing files, and commit to `main`. No SQL changes are required.

## Test
Open an In the Process prospect, open Book Next Step, and test both calendar buttons. Export should start a calendar invite download and show a status message. Book should show “Starting calendar booking…” immediately, then continue with the existing booking flow.
