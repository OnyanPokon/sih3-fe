# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .

# Default build command follows package.json (`npm run build`).
# Override with --build-arg BUILD_CMD=build:staging only if that script exists.
ARG BUILD_CMD=build
RUN npm run ${BUILD_CMD}

# Runtime stage
FROM nginx:1.27-alpine

# Copy custom nginx config with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
