# Business Owner App v5.3.69

## Update
- Adds a Spouse Partnership section to Settings.
- Adds spouse invitation-link creation and copying.
- Detects spouse invitation links and accepts them after the invited user signs in.
- Displays whether an account has no partnership, a pending partnership invitation, or an active partnership.
- Uses the existing Supabase authentication/session and REST request patterns.
- Preserves existing sponsor invitations, calendar settings, reading/activity sync, and existing app screens.

## Database prerequisite
The six partnership tables and the `create_business_partnership_invite()` and `accept_business_partnership_invite(uuid)` RPC functions must already exist in Supabase.

This update implements account linking only. Shared dashboard metrics, onboarding synchronization, and partnership-level calendar approval integration are not included yet.

## Install
1. Extract this ZIP.
2. Upload/replace all files in the root of the existing GitHub Pages repository.
3. Commit the changes.
4. Close and reopen the installed app or refresh the website.
