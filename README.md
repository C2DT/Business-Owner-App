# IBO App v5.3.0

This package is the v5.3.0 release candidate based on the v5.2.93 app.

## Release updates
- Updates the app title, home-screen version label, and runtime version labels to v5.3.0.
- Updates the service-worker cache identifier to `business-owner-v5-3-0` so existing cached assets are replaced.
- Includes the v5.3.0 Supabase private per-user app-state backup setup.
- Preserves the existing Google Calendar integration and prior app functionality.

## Publishing
1. Extract this ZIP.
2. Upload `index.html`, `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` to the root of the `Business-Owner-App` GitHub repository, replacing files with the same names.
3. Commit to the `main` branch.
4. Open the GitHub Pages app and refresh. If an older version remains visible, close the app/browser tab and reopen the site.

## Database
Run `SUPABASE_v5_3_0_SETUP.sql` in Supabase SQL Editor before publishing if it has not already been run.

## Important
The cloud backup layer is a per-user section snapshot foundation. It is not yet the complete conflict-safe synchronization, six-month habit retention, streak summary, or downline record-transfer system. Do not clear browser storage until cross-device migration and restoration have been tested.
