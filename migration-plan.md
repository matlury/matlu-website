# Migration Plan: Gatsby to Next.js

This document outlines the steps to migrate the `matlu-nw` project from Gatsby to Next.js using the App Router.

## Phase 1: Preparation and Setup

1.  **Initialize Next.js:**
    - [x] Install `next`, `react`, and `react-dom`.
    - [x] Update `package.json` scripts (`dev`, `build`, `start`, `lint`).
    - [x] Create `next.config.ts`.
2.  **Infrastructure:**
    - [x] Move `static/` directory content to `public/`.
    - [x] Create `src/app` directory.
    - [x] Setup base `layout.tsx` and `page.tsx` (for redirection).
    - [x] Create `src/app/[lang]/layout.tsx`.
3.  **Dependencies:**
    - [x] Install `sass` (and downgraded to ~1.78.0 to fix legacy API warnings).
    - [x] Install `qs` and `@types/qs`.
    - [x] Install `@apollo/client`, `graphql`, and `graphql-tag`.
    - [x] Install `typed-scss-modules` for SCSS typing.
    - [x] Install `stylelint-config-standard-scss`.

## Phase 2: Core Components and Styling

1.  **Global Styles:**
    - [x] Configure Next.js to use the existing SCSS files. Added `all.css` and Google Fonts to `src/app/[lang]/layout.tsx`.
    - [x] Refactored SCSS files to avoid `mixed-decls` deprecation warnings.
    - [x] Fixed `stylelint` issues and updated config.
2.  **Shared Components:**
    - [x] Migrate `src/components/image.tsx` to use `next/image`.
    - [x] Migrate `src/components/Nav.tsx`, `NavFi.tsx`, `NavEn.tsx` to be compatible with Next.js, now using GraphQL (Strapi v5 flat structure).
    - [x] Migrate `src/components/Footer.tsx`, `FooterFi.tsx`, `FooterEn.tsx`.
    - [x] Migrate `src/components/CalendarEvent.tsx` and `src/components/CalendarEvents.tsx` to use `fetchGraphQL` (Strapi v5 flat structure).
    - [x] Migrate `src/components/ContactForm.tsx` to be a Next.js Client Component.
    - [x] Migrate `src/components/Documents.tsx` to use `fetchGraphQL` (Strapi v5 flat structure).
3.  **Layout:**
    - [x] Re-implement `src/components/Layout.tsx` as `src/app/[lang]/layout.tsx`.

## Phase 3: Data Fetching Layer

1.  **Strapi API Client:**
    - [x] Refactor `src/lib/strapi.ts` utility to use Apollo Client for GraphQL queries.
2.  **Type Definitions:**
    - [x] Implemented TypeScript types for Strapi v5 flat structure.
    - [x] Generated type definitions for SCSS modules.

## Phase 4: Page Migration

1.  **Static Pages:**
    - [x] Migrate `src/pages/index.tsx` to `src/app/[lang]/page.tsx`, now using GraphQL.
    - [x] Create `src/app/page.tsx` for redirecting to default language.
    - [x] Migrate `404.tsx` to `src/app/not-found.tsx`.
    - [x] Migrate `ilotalo.tsx` to `src/app/[lang]/ilotalo/page.tsx`.
    - [x] Migrate `thank-you.tsx` to `src/app/[lang]/thank-you/page.tsx`.
2.  **Dynamic Pages (Strapi):**
    - [x] Implement `src/app/[lang]/[page]/page.tsx` using `generateStaticParams` and GraphQL (Strapi v5 flat structure).
3.  **Board Pages:**
    - [x] Implement `src/app/[lang]/board/[[...year]]/page.tsx` using `generateStaticParams` and GraphQL (Strapi v5 flat structure).
4.  **Internationalization (i18n):**
    - [x] Implement localized routing using `[lang]` dynamic segment.

## Phase 5: Features and Integration

1.  **SEO:**
    - [x] Implement `generateMetadata` for all pages with OpenGraph and Twitter support.
2.  **Forms:**
    - [x] Migrate `ContactForm` (client component).
3.  **Sitemap & Robots:**
    - [x] Use Next.js `sitemap.ts` and `robots.ts`, now using GraphQL.

## Phase 6: Testing and Finalization

1.  **Verification:**
    - [x] Passed TypeScript type check (`tsc`).
    - [x] Passed CSS linting (`stylelint`).
2.  **Cleanup:**
    - [x] Removed Gatsby configuration files and dependencies.
    - [x] Deleted `.cache` and `public` (Gatsby build output) folders.
    - [x] Removed unused `src/pages`, `src/templates`, and `src/api` directories.
    - [x] Removed `react-helmet`.

## Final Summary
The migration is complete. The application is now running on Next.js 15+ using the App Router, with GraphQL data fetching from Strapi v5. All styles are typed and linted, and SEO is handled via the Metadata API.
