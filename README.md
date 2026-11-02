# IBO App v5.3.5 — PIP Scheduler Button Fix

## What's changed
- Fixed the PIP/Outreach Scheduler's **Book Next Step** button to locate its scheduling form relative to the clicked contact card, rather than relying on a dynamically constructed element ID.
- The scheduling panel is now explicitly unhidden and its display is set with `!important` so card and overlay styling cannot keep it hidden.
- The date/time default and focus behavior are retained.
- The existing appointment save, Google Calendar booking, and .ics export workflows are unchanged.
- All app version labels updated to v5.3.5.
- Service-worker cache updated to force clients to fetch the new release.

## Publishing
Extract the ZIP and upload all files into the GitHub repository root, replacing the existing files, then commit to `main`.

No new SQL is required.

## Test
Open an In the Process prospect and tap **Book Next Step**. The scheduling fields should expand directly underneath that contact card. Then verify the date/time, facilitator, and Book on Calendar / Export Calendar Invite buttons are visible.

This is a targeted UI-button fix; it does not change the appointment booking backend or Google Calendar permissions.


## v5.3.7 Calendar action rebuild

The Book on Calendar and Export Calendar Invite controls now use a delegated click handler for dynamically-rendered prospect cards. Both actions disable duplicate clicks, validate the selected appointment, and report failures in the scheduling panel instead of failing silently. Google OAuth, approval checks, and the Supabase calendar-booking endpoint remain the existing backend integration and must be verified in the deployed environment.
