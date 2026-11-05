# Business Owner App v5.3.66

This update is based on v5.3.65, which is the project baseline. Existing app features and assets are retained.

## Changes in v5.3.66
- Restored left alignment for the “Reading - click here” text in the Daily / Weekly Activities row.
- Outreach Scheduler Google Calendar button now reflects the saved connection status: red when not connected, green when connected, and shows the connected Google account email when available. The status is read from the existing Google Calendar status endpoint also used by Settings.
- Google Calendar events created through Set Your Plan now identify whether the contact is a prospect or customer. Prospect events include the prospect category (for example A/B list or C list in person); customer events include the customer category (for example potential, ordering, subscription, or Ditto). The event description repeats this classification for clarity.
- Service worker cache name updated to force clients to fetch the new app files.

## Install
1. Extract the ZIP.
2. Upload/replace all files in the root of the existing GitHub Pages repository.
3. Commit the changes.
4. Reopen the app. If an old copy remains visible, close the browser tab and reopen the site.

## Notes
- No Supabase Edge Function code or database schema changes are included.
- Google Calendar account email is displayed only when the existing status endpoint returns `connected_email`.
- Existing v5.3.65 app icons, manifest, and other assets are retained.
