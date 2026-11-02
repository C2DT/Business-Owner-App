# IBO App v5.3.3 — Cloud Restore Priority Update

This release corrects the cross-device restore behavior found in v5.3.2.

## Version labels
- Browser title and in-app version labels: v5.3.3
- HTML release metadata: v5.3.3
- Service-worker cache: `business-owner-v5-3-3-cloud-restore-priority`

## Changes
- Cloud rows now include `updated_at` during restore.
- Each signed-in device records a local modified timestamp for synced app sections when the user edits them after cloud initialization.
- On restore, the newer version wins for conflicting values: a local section wins only when its recorded edit time is newer than the cloud row; otherwise the cloud copy wins.
- Devices upgraded without local edit timestamps treat existing local values as older than the cloud copy. This is important for correcting stale values already on a device.
- Deep merge retains cloud-only and local-only records while resolving conflicting fields by the selected version priority.
- Existing post-restore screen reload hooks are retained for Outreach, PIP, Budget, and the home/team views.
- The existing Budget input-save improvement from v5.3.2 is retained.

## Publishing
Replace the files in the GitHub repository root with the files in this ZIP and commit to `main`.

No new SQL is required. Do not rerun the existing Supabase setup SQL.

## Data safety and limitations
- Do not clear browser storage or uninstall the app.
- The cloud record is the authority for devices that have not recorded a newer local edit timestamp.
- Conflict timestamps are tracked at the synced-section level, not independently for every field or record. This is safer than unconditional local preference but is not a full transaction-level conflict-resolution system for simultaneous edits on multiple devices.
- Verify the cloud record and the restored device before making new edits on a device that previously had stale data.
