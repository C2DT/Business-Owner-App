# IBO App v5.3.0 — November 1 release candidate

## Included
- Fixes the Set Your Plan radio-selection helper used by the Customers/Prospects wizard.
- Adds private per-user Supabase backup/synchronization for the app's existing local sections:
  - 100–300 PV / daily onboarding and habit data (`iboAppV4_2`)
  - Team of 10 (`iboTeam10V1`)
  - People in the Process (`iboPIPV2`)
  - Customers, prospects, outreach contacts and appointments (`iboOutreachV5`)
  - Budget Session (`iboBudgetSession_v1`)
  - Section unlock flags
- Keeps the existing Supabase authentication, daily Audio/Reading sync, sponsor relationships, and Google Calendar integration in place.
- Cloud records are private to the signed-in owner under RLS; this does not expose budgets or contacts to an upline.

## Required database step
1. In Supabase, open **SQL Editor**.
2. Paste and run `SUPABASE_v5_3_0_SETUP.sql`.
3. Confirm the `user_app_state` table exists and RLS is enabled.
4. Only then publish the updated `index.html`.

## Publish
Upload the contents of this ZIP into the root of the existing GitHub repository, replacing the old files, then commit to `main`.

## Important release notes / limitations
- This is a first cloud-backup layer over the existing app sections, not yet a normalized CRM database. The existing JSON data structures remain unchanged.
- Initial sync merges matching records by `id`/`name` and retains distinct array entries. Scalar conflicts favor the device currently syncing.
- This version does not yet implement reliable cross-device deletion/tombstone handling, full record ownership transfer to an upline, six-month habit-history pruning with persistent streak summaries, or the Scriptable widget. Do not represent those as completed.
- Do not clear browser storage during rollout. Each user should sign in on the device containing their existing records and leave the app open/online until the cloud backup status appears.
- Test with two accounts/devices before asking the whole team to rely on cross-device sync. Existing data is not deleted by this migration.
- No service-role key is included in the browser app.
