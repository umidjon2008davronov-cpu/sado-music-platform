# SADO Music Platform

SADO — o‘zbek tilini birinchi o‘ringa qo‘yadigan, demo audio bilan ishlaydigan zamonaviy musiqa platformasi.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/sado/src/App.tsx` — client-side routing and application composition
- `artifacts/sado/src/components/sado-shell.tsx` — shared shell, navigation, player state, and reusable track UI
- `artifacts/sado/src/pages/` — Home, Search, Library, Create, and Profile screens
- `artifacts/sado/src/data/mockMusic.ts` — validated demo tracks, local artwork/audio paths, moods, and artist data
- `artifacts/sado/src/i18n/translations.ts` — Uzbek, Russian, and English interface copy
- `artifacts/sado/src/index.css` — SADO visual tokens, dark/light surfaces, and motion utilities

## Architecture decisions

- V1 is frontend-first and uses isolated mock music data so backend catalog, accounts, and AI services can be connected later without rewriting page structure.
- Music playback is centralized in `SadoProvider`; pages consume player actions through `useSado` rather than owning separate audio state.
- Region selection is persisted only as local UI state and deliberately does not alter copy until verified regional language data is available.
- Each V1 track points to a separate original WAV sketch in `artifacts/sado/public/audio/`; these are labeled as demo audio and are not a copyrighted SADO catalog.

## Product

The app provides discovery by mood, search across songs/artists/albums/playlists, a saved-song library, a responsive demo player, language selection, region foundation, appearance settings, and disabled SADO AI creation surfaces.

## User preferences

- Default interface language is natural literary Uzbek; Russian and English are available through the language selector.
- Keep the product calm, premium, minimal, dark-first, and free from unrelated integrations, ads, analytics, or login flows.

## Gotchas

- Run the web artifact through its managed workflow so `PORT` and `BASE_PATH` are provided.
- Use the SADO translation object for visible interface copy so language switching remains complete.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
