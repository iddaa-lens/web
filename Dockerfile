FROM node:22-slim AS base

# Install dependencies only when needed
FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends libc6-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variable for build time
ENV NEXT_PUBLIC_API_URL=https://api.iddaalens.com

# Build the application
RUN npm run build

# Production image - use distroless for minimal size
FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

# Copy the Next.js standalone build
COPY --from=builder --chown=65532:65532 /app/.next/standalone ./
COPY --from=builder --chown=65532:65532 /app/.next/static ./.next/static

# Copy only optimized public assets
COPY --from=builder --chown=65532:65532 /app/public/logo-200.png ./public/
COPY --from=builder --chown=65532:65532 /app/public/logo-64.png ./public/
COPY --from=builder --chown=65532:65532 /app/public/*.svg ./public/

# Use distroless non-root user (65532)
USER 65532

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["server.js"]