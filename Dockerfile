# Stage 1: Build the React SPA
FROM node:20-alpine AS spa-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build the Node BFF
FROM node:20-alpine AS bff-builder
WORKDIR /app
COPY bff/package*.json ./
RUN npm ci
COPY bff/ ./
RUN npx tsc

# Stage 3: Production dependencies
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY bff/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 4: Minimal Final Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Run as non-root user for security
USER node

# Copy BFF production dependencies
COPY --chown=node:node --from=prod-deps /app/node_modules ./bff/node_modules
COPY --chown=node:node --from=prod-deps /app/package*.json ./bff/

# Copy built BFF
COPY --chown=node:node --from=bff-builder /app/dist ./bff/dist

# Copy built SPA
COPY --chown=node:node --from=spa-builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "bff/dist/index.js"]
