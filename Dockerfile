# Multi-stage build for JellyfinWatchlist
# Stage 1: Build the Angular Web application
FROM node:22-alpine AS web-builder

WORKDIR /app/web
COPY JellyfinWatchlist.Web/package*.json ./
RUN npm ci
COPY JellyfinWatchlist.Web/ ./
RUN npm run build

# Stage 2: Build the NestJS API application
FROM node:22-alpine AS api-builder

WORKDIR /app/api
COPY JellyfinWatchlist.Api/package*.json ./
RUN npm ci
COPY JellyfinWatchlist.Api/ ./
RUN npm run build

# Stage 3: Production runtime
FROM node:22-alpine

WORKDIR /app

# Copy built API
COPY --from=api-builder /app/api/dist ./api
COPY --from=api-builder /app/api/package*.json ./

# Copy built Angular app to serve as static files
COPY --from=web-builder /app/web/dist/jellyfin-watchlist.web ./public

# Install only production dependencies
RUN npm ci --only=production

# Create config directory
RUN mkdir -p /app/config

# Expose frontend port (NestJS serves Angular static files)
EXPOSE 3000

# Set production environment (always production in container)
ENV NODE_ENV=production
ENV CONFIG_PATH=/app/config

# Default Jellyfin URL (can be overridden at runtime)
ENV JELLYFIN_BASE_URL=http://localhost:8096

# Volume mount point for persistent data (SQLite database, config files)
# Recommended: docker run -v /host/data:/app/config
VOLUME ["/app/config"]

# Start the application
CMD ["node", "api/main.js"]
