# IBO App v5.3.11 — Shared Habit History Fix

## Approved changes

This release contains only the three approved habit-tracking fixes.

### 1. One shared daily-habit record
- 100–300 Points and Team of 10 now use the main app's daily habit record as the single source of truth.
- Changes made in either section are synchronized to the other section's stored data.
- Team of 10 monthly production counters remain stored separately.

### 2. Both reset buttons clear shared habit history
- Either reset button clears daily and weekly habit history for both sections.
- The 100–300 Points monthly production counters are preserved.
- Team of 10 monthly production counters are preserved.
- The 100–300 Points reset continues to reset its own onboarding checklist.
- PIP prospects and Outreach Scheduler data are not changed.
- Each reset asks for confirmation and explains the shared effect.

### 3. Team of 10 calendar coloring
- Green means both Audio and Reading are complete.
- Yellow means exactly one of Audio or Reading is complete.
- Neither completed means the day has no habit-color fill.
- Communication and Association indicators remain visible, but do not affect green/yellow coloring.

## Version consistency
- App title, home-screen version label, body version, and versioned source comments are updated to v5.3.11.
- Service-worker cache is updated to `business-owner-v5-3-11-shared-habit-fix`.

## Publishing
Upload all files in this ZIP to the GitHub repository root, replacing the existing files. Fully close and reopen the installed app. If the old version remains cached, close it again and reopen after the service worker activates.

## Scope intentionally not changed
- Password security remains deferred, as approved.
- Calendar booking and OAuth logic are unchanged.
- No Supabase schema, Edge Function, RLS policy, or backend configuration is changed.
- Other app screens and workflows are preserved.
