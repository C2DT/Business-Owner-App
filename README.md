# IBO App — iPhone Contact Import development package

This development package contains the first iPhone Contact Import account-connection interface and the Supabase backend implementation package.

## Included in this development package
- Settings → iPhone Contact Import panel.
- Signed-in users can generate a one-time, 32-character pairing code that expires after 10 minutes.
- Users can revoke all Shortcut tokens for their account.
- Supabase migration and Edge Function are included under `supabase/`.
- Apple Shortcut action-by-action build instructions are included under `shortcut/`.

## Contact behavior
- Customer → Customer List, category `potential` (Potential Customer).
- Prospect → Prospect List, category `C list in person` (C List in Person).
- Imports update only `iboOutreachV5.contacts[]`; `iboPIPV2` is never touched.
- Duplicate phone numbers require explicit confirmation before classification changes.

## Deployment
Follow `README_CONTACT_SHORTCUT_IMPLEMENTATION.md` for the required Supabase migration, Edge Function deployment, GitHub Pages upload, and Shortcut publishing steps. The actual Apple Shortcut iCloud install link must be created from Apple's Shortcuts app; this cannot be silently installed by a web app.
