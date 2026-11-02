# IBO App v5.3.10 — Calendar Buttons: Duplicate-ID Fix

## Root cause (confirmed)
Opening **People in the Process** from the home shortcut moves the Connections panel into a popup and renders the prospect
list again, while an older copy of the same list stays in the hidden PIP screen. Every element id (date, facilitator,
meeting notes, status message) therefore existed twice. The calendar code looks elements up by id, and the browser returns
the FIRST match, which is the hidden copy. As a result:

- the date field it read was the hidden, empty one, so both buttons stopped with "Choose a meeting date and time first.",
  even though the visible field had a date;
- every status or error message was written into the hidden copy, so nothing appeared on screen (the "silent" failure);
- the facilitator dropdown it read could also be the hidden copy, not the one you picked.

This affected every earlier version of the buttons.

## What changed in v5.3.10
- Only one copy of the prospect list exists at a time. Rendering into the popup empties the hidden list and vice versa.
- Element lookups prefer the copy that is visible on screen, as a second safeguard.
- The scheduling runner and the status-message handle use the same visible-aware lookup.
- Version label and service-worker cache name bumped to v5.3.10.

## Carried over from v5.3.9
- Status banner pinned to the bottom of the screen for every result and error; errors name the failing step.
- Timeouts on every network call; backend error text and HTTP status are shown.
- List re-renders are paused while a booking is running; the sign-in token is refreshed only when needed.
- The booked Google event ID is saved against the current stored record.
- Export Calendar Invite uses the iPhone/iPad share sheet (plus a Google Calendar link fallback).
- Service worker: network-first for the app page; Supabase/Google requests are never intercepted.

## Publishing
Upload all files to the GitHub repository root, replacing the existing ones. Fully close and reopen the installed app twice
(first launch installs the new service worker, second runs it). The version label should read v5.3.10.

## Not changed (cannot be verified from this ZIP)
The Supabase Edge Function `Google-calendar` (routes /book, /status, /connect), its CORS handling, the Google OAuth
credentials, and facilitator approval records. If, after the date check now passes, the banner reports an error from the
booking service, that message comes from the backend.
