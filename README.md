# IBO App v5.3.2 — Budget Input Sync Update

This is the v5.3.2 release package.

## Version labels
- Browser title: Business Owner App v5.3.2
- Home-screen subtitle: v5.3.2
- HTML release metadata: v5.3.2
- Team-loading and fallback labels: v5.3.2
- Service-worker cache: business-owner-v5-3-2-budget-input-sync

## Changes
- Budget fields now save to local storage on every input as well as on change.
- This includes monthly and annual income fields, expenses, debts, savings, and editable budget-preview fields.
- The existing cloud-sync mechanism is retained; each local save schedules the existing debounced Supabase backup.
- Updated the budget note to explain local saving and automatic cloud backup when signed in.
- Updated all user-visible v5.3.1 version labels to v5.3.2.
- Updated the service-worker cache name so browsers fetch the new release.

## Publishing
Replace the files in the GitHub repository root with the files in this ZIP, then commit to `main`.

No new SQL is required. Do not rerun the existing Supabase setup SQL.

## Data safety
Do not clear browser storage or uninstall the app during this update. Keep the device containing the most complete budget data intact until the cloud record has been verified on another device.

## Important limitation
This is a targeted budget-input save improvement. It does not add timestamp-based conflict resolution or guarantee that an older device's conflicting local edits will always win. Verify the latest budget values in Supabase and on the second device before relying on the sync.
