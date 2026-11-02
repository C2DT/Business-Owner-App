# IBO App v5.3.8 — Calendar Buttons Fixed

## Calendar action repair
- Restored direct inline click actions for **Book on Calendar** and **Export Calendar Invite (.ics)**. The buttons no longer depend on a delegated document-level click listener.
- Added one explicit action runner with independent branches for booking and invite export.
- Added visible validation and error messages for missing contacts, missing scheduling forms, missing date/time, unavailable functions, and runtime failures.
- Added busy-state protection to prevent duplicate submissions.
- Updated the app title, visible version labels, body version, and service-worker cache namespace to **v5.3.8**.

## Publishing
Extract the ZIP and upload **all contents** to the GitHub repository root, replacing the existing files. Commit the changes to the published branch. Then fully close and reopen the installed Safari app so the new service-worker cache can activate.

## Test order
1. Open a prospect under **In the Process** and tap **Book Next Step**.
2. Choose a date/time and tap **Export Calendar Invite (.ics)**. Confirm that an `.ics` file is downloaded and that the status message confirms it.
3. Then test **Book on Calendar**. A successful local save is not proof of a Google Calendar booking; verify the event on the selected facilitator calendar.

## Backend note
This release repairs the frontend button dispatch and error visibility. It does not replace or certify the Supabase Edge Function, Google OAuth credentials, or facilitator approval records. If booking reports an error, use the exact message displayed in the scheduling panel to diagnose the backend next.
