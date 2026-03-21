# Matlu-NW Project Guide

This project is the frontend for the matlu.fi website, built with Next.js using the App Router and static export.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **UI Library:** Chakra UI 3
- **Styling:** SCSS Modules + Styled Components
- **Data Fetching:** Apollo Client (GraphQL)
- **Form Management:** TanStack React Form
- **Testing:** Vitest + React Testing Library
- **Icons:** React Icons (FontAwesome used via CSS in some places)

## Key Directories
- `src/app`: App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/locales`: Translation files for internationalization.
- `src/lib`: Apollo client configuration and other library initializations.
- `src/tests`: Unit and integration tests.
- `docs`: Contains specialized guides for using Chakra UI 3 (`llm-*.txt`).

> **Tip:** Check the `docs/` folder for comprehensive guides on using Chakra UI components, styling, and theming. These files are optimized for AI context.

## Development Workflow
- **Start Dev Server:** `npm run dev` (runs on port 8000)
- **Build Static Site:** `npm run build` (outputs to `out/`)
- **Linting:** `npm run lint` or `npm run lint:fix`
- **Type Checking:** `npm run typegen:scss` (generates types for SCSS modules)
- **Testing:** `npm run test`

## Standards & Conventions
- Use TypeScript for all new files.
- Prefer SCSS Modules for component-specific styling.
- Follow the existing internationalization pattern using files in `src/locales`.
- Ensure all pages are compatible with `output: 'export'` (no server-side features like `getServerSideProps` or dynamic server rendering).
