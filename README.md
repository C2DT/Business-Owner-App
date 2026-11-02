# IBO App v5.3.7 — Delegated PIP Calendar Click Fix

## What's changed
- Replaced the inline Book on Calendar click attribute with data attributes.
- Added a document-level capture-phase delegated click listener so clicks continue to work after the PIP list is dynamically re-rendered.
- The listener explicitly invokes the existing booking handler and reports if the click bridge is unavailable.
- Existing appointment persistence, Google Calendar booking, secure Supabase Edge Function, calendar permissions, and .ics fallback are unchanged.
- All app version labels updated to v5.3.7.
- Service-worker cache updated.

## Publishing
Upload all files from this ZIP to the GitHub repository root, replace existing files, and commit to main. No new SQL is required.

## Test
Open an In the Process contact, open Book Next Step, select the appointment details, then tap Book on Calendar. The status should change immediately. If the status changes to a specific error, share its exact text.
