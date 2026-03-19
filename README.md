# Matlu Website (Next.js)

This is the official website for Matlu ry, built with Next.js, TypeScript, and Strapi CMS.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Static Export](#static-export)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Image Optimization](#image-optimization)
- [Event Request Flow](#event-request-flow)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- Next.js App Router (app/ directory)
- TypeScript throughout the codebase
- Static export (`output: "export"` in next.config.ts)
- Strapi CMS integration (REST and GraphQL)
- Multilingual support (Finnish and English)
- SCSS styling with custom variables and mixins
- Jest for unit testing
- SEO-friendly sitemap generation

## Getting Started

### Prerequisites

- Node.js 20.9+
- npm 9+

### Install dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the project root:

```
SITE_URL=http://localhost:3000
STRAPI_URL=http://localhost:1337
```

Adjust these as needed for your environment.

## Development

Start the development server:

```bash
npm run dev
```

- The site will be available at http://localhost:3000
- By default, images are loaded from the local Strapi instance (`localhost:1337`).
- To use production Strapi, update the `images.remotePatterns` in `next.config.ts`.

## Static Export

To generate a static export (for Netlify, GitHub Pages, etc):

```bash
npm run build
```

The output will be in the `out/` directory.

## Testing

Run all tests:

```bash
npm test
```

- Jest is used for unit testing (see `src/lib/__tests__`)
- TypeScript is fully supported in tests

## Environment Variables

- `SITE_URL`: The base URL for sitemap and canonical links
- `STRAPI_URL`: The base URL for Strapi API (REST/GraphQL)

## Image Optimization

- Next.js image optimization is configured for both local and production Strapi uploads
- Update `next.config.ts` to add your production Strapi URL when deploying

## Event Request Flow

Public users can submit event additions from the events page. The flow is:

1. Open the "Add event" dialog on `/events` or `/en/events`.
2. Fill event details (name, times, titles, optional location text, optional link, optional descriptions).
3. Optionally set exact location coordinates:
	- Click on the embedded map picker (react-leaflet), or
	- Enter latitude/longitude manually.
4. Optionally use location autocomplete suggestions. Suggestions are fetched from Strapi endpoint:
	- `GET /api/event-locations/suggestions`
	- This list is a separate location index and only contains entries indexed from approved requests.
5. Submit to:
	- `POST /api/event-requests/submit`
6. After approval in CMS, the event appears in website listings.
7. If approved event has coordinates, event cards can show a click-to-open map dialog (to avoid cluttering the main event list).

Notes:

- The website supports two location modes:
  - Location text only
  - Location text + coordinates
- Leaflet CSS is loaded in app layout for map rendering.
- Coordinates are optional and validated before submit.

## Deployment

- The site is designed for static hosting (current hosting donee in S3 bucket)

## License

MIT
