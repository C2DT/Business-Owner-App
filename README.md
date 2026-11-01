# IBO App v5.3.1 — Sync Restore Fix

This is the v5.3.1 release package.

## Version labels
- Browser title: Business Owner App v5.3.1
- Home-screen subtitle: v5.3.1
- HTML release metadata: v5.3.1
- Team-loading and fallback labels: v5.3.1
- Service-worker cache: business-owner-v5-3-1-sync-restore

## Changes
- Rehydrates the Outreach, People in the Process, and Budget Session in-memory models after cloud data is restored into local storage.
- Refreshes those screens from restored values.
- Prevents blank local defaults from overwriting populated cloud values during a merge.
- Forces browsers to fetch the new release through the updated service-worker cache.
- Preserves the existing Supabase authentication and Google Calendar integration.

## Publishing
Replace `index.html`, `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` in the GitHub repository root, then commit to `main`.

No new SQL is required if the v5.3.0 setup already ran successfully. The included SQL file is retained as a reference only; do not rerun it unnecessarily.

## Important limitation
This is a restore/display correction, not a complete timestamp-aware multi-device conflict-resolution system. Keep browser data intact and test on two devices before team-wide rollout.
