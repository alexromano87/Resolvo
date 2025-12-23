# ===================================
# RESOLVO Frontend - Dockerfile
# ===================================

# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments (opzionali - auto-detect funziona)
ARG VITE_API_URL
ARG VITE_APP_NAME=RESOLVO
ARG VITE_APP_VERSION=1.0.0

# Set environment variables per build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION

# Copia package files
COPY package*.json ./

# Installa dipendenze
RUN npm ci

# Copia codice sorgente e assets
COPY . .

# Build production
RUN npm run build

# ===================================
# Stage 2: Production con Nginx
FROM nginx:alpine

# Installa curl per health check
RUN apk add --no-cache curl

# Copia build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configurazione Nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Esponi porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:80/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
