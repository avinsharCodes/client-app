FROM node:20-alpine AS builder

WORKDIR /app

# 1. Install BFF dependencies and build BFF
COPY bff/package*.json ./bff/
RUN cd bff && npm install
COPY bff/ ./bff/
RUN cd bff && npx tsc

# 2. Install SPA dependencies and build SPA
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 3. Final Production Runtime Image
FROM node:20-alpine

WORKDIR /app

# Copy built BFF and dependencies
COPY --from=builder /app/bff/package*.json ./bff/
RUN cd bff && npm install --omit=dev
COPY --from=builder /app/bff/dist ./bff/dist

# Copy built SPA artifacts
COPY --from=builder /app/dist ./dist

# Set permissions or environment variables if needed
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "bff/dist/index.js"]
