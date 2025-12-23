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

# Copia build artifacts dal builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Crea configurazione Nginx inline
RUN echo 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    gzip on;\n\
    gzip_vary on;\n\
    gzip_min_length 1000;\n\
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;\n\
\n\
    add_header X-Frame-Options "SAMEORIGIN" always;\n\
    add_header X-Content-Type-Options "nosniff" always;\n\
    add_header X-XSS-Protection "1; mode=block" always;\n\
\n\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
        access_log off;\n\
    }\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    location /health {\n\
        access_log off;\n\
        return 200 "healthy\n";\n\
        add_header Content-Type text/plain;\n\
    }\n\
\n\
    location ~ /\. {\n\
        deny all;\n\
        access_log off;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Esponi porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:80/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
