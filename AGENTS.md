# AGENTS.md

## What this repo is

Frontend for matlu.fi (Matlu ry student association). Next.js App Router with
`output: "export"` — a **static site**. Content comes from an external Strapi CMS
over GraphQL. There is no server runtime: no route handlers, no `getServerSideProps`,
no middleware that runs in production. Anything that needs a server cannot work.

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` (port **8000**) |
| Build (static export) | `npm run build` — must run after `next build`, see below |
| Lint | `npm run lint` (oxlint) |
| Format | `npm run format` / `npm run format:check` (oxfmt) |
| Typecheck | `npm run typecheck` (`tsc --noEmit`) |
| Tests | `npm test` (Vitest, **watch mode** by default) |
| Single test | `npx vitest run <path>` |
| Serve built site | `npm run serve` |

Verification order that matters: `npm run lint` → `npm run typecheck` → `npx vitest run`.

`npm test` is Vitest in watch mode, not a one-shot run. Use `npx vitest run` in
scripts and CI-like contexts.

`npm run typegen:scss` regenerates `src/style.scss.d.ts`. It is codegen, **not**
type checking.

## Build pipeline (order is load-bearing)

`npm run build` = `node scripts/optimize-logos.mjs && next build && npm run optimize`.

- `scripts/optimize-logos.mjs` runs **before** `next build`. It fetches member
  logos from the CMS, resizes to 180x46 WebP with sharp, and writes
  `public/logos/members/` plus `manifest.json`. Those files are **generated and
  gitignored**.
- `optimize.mjs` runs **after** `next build` and rewrites HTML in `out/`
  (inlines small CSS). It does not optimize images.

Do not add image work to `optimize.mjs`; the logo pipeline is the only real
image optimization and it happens in the pre-build script.

## Tests

- Vitest + jsdom + React Testing Library. Config: `vitest.config.mts`.
- Only two test files exist, both in `src/tests/components/`.
- **CMS tests need a live Strapi at `localhost:1337`.** `ci.yml` excludes tests
  for this reason — CI runs lint and typecheck only. A green CI does not mean
  tests pass.
- Component tests mock `next/dynamic` and `react-google-recaptcha`; use that
  pattern rather than loading Leaflet or the captcha in jsdom.

## Styling

SCSS Modules plus `src/style.scss` (global). There is **no styled-components**,
no Chakra `css` prop in new code beyond what exists; Chakra UI 3 components are
used directly. `src/style.scss.d.ts` is generated.

## Environment variables

Read in code (executable truth — the README is stale on these):

- `API_URL` — server-side Strapi base (build time). Used by `cms-data.ts`, `strapi.ts`.
- `NEXT_PUBLIC_API_URL` — browser Strapi base. Used by `src/api.ts`, `strapi.ts`.
- `ACCESS_TOKEN` — Strapi API token (build time).
- `SITE_URL` — canonical/sitemap base, defaults to `https://www.matlu.fi`.
- `NEXT_PUBLIC_FEEDBACK_FORM_HANDLER_URL` — contact form POST target.
- `NEXT_PUBLIC_EVENT_REQUEST_RECAPTCHA_SITE_KEY` — reCAPTCHA site key. When
  empty, forms render **no captcha and submit unverified** with no error. The
  name must match exactly; `deploy.yml` previously exported a different name and
  silently disabled the captcha.

The README lists `STRAPI_URL` and `SITE_URL` and port 3000. Those are wrong.
Trust `package.json` scripts and the `process.env.*` reads in `src/`.

## Deploy

`.github/workflows/deploy.yml`: on push to `main`, build, then `s3-sync-action`
to S3 twice — `out/_next/static` immutable (1-year cache), then all of `out/`
with `--delete` and no-cache. CloudFront is invalidated after.

Anything in `public/` is published to S3, even if no page links it. Unused
assets belong in `assets/`, not `public/`.

## Conventions

- Two languages everywhere: `fi` and `en`. Locale strings live in `src/locales/`.
  New user-facing text needs both.
- New pages must be static-export safe and added in both `src/app/...` and
  `src/app/en/...` where a translation exists.
- `src/queries/` holds GraphQL documents; `src/lib/strapi.ts` wires Apollo.
- SCSS variables/mixins: `src/_vars.scss`, `src/_mixins.scss`.

## Existing instruction files

- `.github/copilot-instructions.md` — do not read or modify gitignored files.
- `GEMINI.md` — stale Gemini CLI guide. Claims styled-components (not present)
  and mislabels `typegen:scss` as typecheck. Do not trust; prefer this file.
- `docs/llm-*.txt` — Chakra UI 3 component/styling/theme reference. Useful when
  writing UI.
