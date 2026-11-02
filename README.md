# IBO App v5.3.9 — Restore Proven Calendar Button Wiring

## What's changed
- Restored the exact inline `onclick` button wiring used by the supplied v5.2.88 archive, where the calendar buttons were reported to work.
- Book on Calendar now calls the existing `pipBookNextStep(id)` function directly.
- Export Calendar Invite now calls the existing `pipDownloadICS(id)` function directly.
- Removed the newer direct-listener binding block that replaced the working inline wiring.
- Kept the current v5.3.8 booking/export functions and the current secure Google Calendar/Supabase integration unchanged.
- Kept all other v5.3.8 app features and data structures unchanged.
- Updated the service-worker cache name and app version labels.

## Publishing
Upload all files from this ZIP to the GitHub repository root, replace existing files, and commit to `main`. No new SQL is required.

## Test
Open an In the Process contact, open Book Next Step, select a date/time, then test Export Calendar Invite first and Book on Calendar second.
