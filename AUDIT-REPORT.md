# SADO audit — profile + creator community update

## Applied
- Replaced the hard-coded greeting identity with a per-browser SADO profile name, defaulting to **Umid**.
- Added editable profile name in Profile; the greeting updates from the saved name.
- Persisted theme and region selections.
- Fixed listening-history end-of-track logic so the track that actually finished is recorded.
- Added creator data and a natural creator feed with posts, likes, comments, sharing affordance and follow state.
- Added creator channel pages with subscriber count, posts, track list and play action.
- Added creator navigation from the home feed.
- Kept creator content lightweight and human-looking rather than adding artificial AI-style decoration.

## Verification note
The archive does not contain installed dependencies, so a full `pnpm run typecheck` / production build was not executed in this environment. Source-level changes were checked for consistency; run the project's normal typecheck/build in Replit before deployment.
