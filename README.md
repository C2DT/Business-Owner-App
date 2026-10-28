# IBO App v5.2.85

- Renamed the user-facing “PQI Notes” label to “Prospect Notes” throughout the app and calendar descriptions.
- Preserves the working Book Next Step toggle from v5.2.71 and the newer facilitator/upline options.
- Calendar behavior remains a Google Calendar template link or downloadable .ics file; this does not directly create events on another person's calendar.

Upload the seven files in this ZIP to the repository root and commit to `main`.


Version 5.2.87 — Shared Calendar Booking
- Wires the Prospect In Process “Book on Calendar” action to the Supabase Google-calendar /book endpoint for approved uplines.
- Reuses an already-saved local appointment with the same type and start time, avoiding duplicate local entries during retry.
- Matches the selected facilitator against approved upline profiles and records the returned Google event ID/link after successful booking.
