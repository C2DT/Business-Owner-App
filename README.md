# IBO App v5.2.79

GitHub Pages app files for the Settings, sign-in gate, mailbox, and calendar-access request workflow update.

## GitHub upload
Upload the contents of this folder to the repository root and commit the changes. This ZIP contains only app files; it does not contain SQL migrations.

## Supabase prerequisite
The calendar-access request tables and RPC functions must already be installed. The upline inbox also needs a policy allowing an addressed upline to read the parent request metadata; see the separate SQL instructions provided with this release.

## Important
- Login state is stored in localStorage and refreshed through Supabase Auth when possible; users stay signed in until they sign out or the refresh token becomes invalid.
- Calendar requests are submitted to Supabase using the authenticated session.
- Google Calendar OAuth and event creation on another user's calendar are not completed by this version; approval records are not a substitute for Google authorization.


Version 5.2.79: moved Enable Badges into its own expandable Settings section and added a signed-in home subtitle that loads the direct upline last name as the team name.
