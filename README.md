# Business Owner App — v5.2.61 Sponsor Invitations

## What's new in v5.2.61
- Added sponsor invitation link generation for signed-in users.
- Each generated link uses the existing Supabase `create_sponsor_invite()` function and is intended to expire after 48 hours.
- Added invitation acceptance through `accept_sponsor_invite()` when a recipient opens a link, signs in, or creates an account.
- Invitation tokens are stored temporarily in the browser while the recipient signs in; the token is removed from the URL after being captured.
- Kept the existing Audio + Reading streak synchronization and local app data.
- Updated the service-worker cache key so GitHub Pages clients can load the new version.

## Publish on GitHub Pages
1. Unzip this package.
2. Replace `index.html`, `manifest.json`, `sw.js`, and `README.md` in the repository root.
3. Keep `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` in the repository root alongside `index.html`.
4. Commit the changes and wait for GitHub Pages to publish.
5. Close the installed app fully, reopen it, and sign in using the Shared Streak Sync panel.
6. Under **Sponsor Invitations**, select **Generate Invite Link**, then copy the link and send it privately to your test user.
7. On the receiving device, open the link, create/sign in to the account, and accept the invitation. If email confirmation is required, return to the same browser/device and sign in after confirming.

## Important notes
- Invitation links are bearer links: anyone who obtains a valid link may attempt to accept it until it expires or is revoked.
- The database must have the `create_sponsor_invite()` and `accept_sponsor_invite(invite_token text)` functions installed, and the app must be allowed to call them for authenticated users.
- This update does not implement Jon Coburn's special future upline setup. The current invitation flow is for a new user joining the inviter's downline.
- Do not put the Supabase service-role key in this app. It uses the project's public publishable key and relies on database security policies.



## v5.2.61 Settings
- Moved Streak Badge, Shared Streak Sync, sign-in/sign-out, and Sponsor Invitations into the Settings screen opened by the gear icon in the top-right corner.
- Added a Clear Data on This Device action with a confirmation prompt. It clears browser-local data and signs out locally; it does not delete Supabase cloud data.
- Sponsor invite links generated from a local file preview now use the published GitHub Pages URL rather than a non-shareable file:/// URL.
