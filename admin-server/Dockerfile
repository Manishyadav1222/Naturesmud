# ── Nature's Mud — Admin Server Dockerfile ──────────────────

# 1. Dependencies Stage
FROM node:20-slim AS deps
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
# Copy package files and Prisma schema
COPY package.json package-lock.json ./
COPY prisma ./prisma/
# Install all dependencies
RUN npm ci

# 2. Builder Stage
FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma Client and build TypeScript
RUN npx prisma generate
RUN npm run build

# 3. Production Runner Stage
FROM node:20-slim AS runner
RUN apt-get update && apt-get install -y openssl dumb-init
WORKDIR /app
ENV NODE_ENV=production

# We copy package.json for starting the server, and production node_modules
COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 expressjs
USER expressjs

EXPOSE 4000
ENV PORT=4000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
