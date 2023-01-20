# https://github.com/vercel/next.js/blob/ca5f265ab86dcb7efb5c6270ad642f0a239beee8/examples/with-docker-compose/next-app/prod.Dockerfile
# Step 1. Rebuild the source code only when needed
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY -package.json package-lock.json* ./
# Omit --production flag for TypeScript devDependencies
RUN npm ci

COPY common ./common
COPY components ./components
COPY pages ./pages
COPY public ./public
COPY services ./services
COPY styles ./styles
COPY codegen.ts .
COPY next.config.js .
COPY tsconfig.json .

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 2. Production image, copy all the files and run next
FROM node:18-alpine AS runner

WORKDIR /app

EXPOSE 3000

# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# Don't run production as root
RUN adduser --system --uid 1001 nextjs
USER nextjs

# openshift randomizes uid but adds that user to gid=0, so chown files to gid 0
# so the process has read rights
COPY --from=builder --chown=nextjs:0 /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:0 /app/.next/standalone ./
COPY --from=builder --chown=nextjs:0 /app/.next/static ./.next/static

CMD ["node", "server.js"]
