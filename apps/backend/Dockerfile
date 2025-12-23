# ===================================
# RESOLVO Backend - Dockerfile
# ===================================

# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze
RUN npm ci

# Copia codice sorgente
COPY . .

# Build dell'applicazione
RUN npm run build

# ===================================
# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Installa dumb-init per gestire correttamente i segnali
RUN apk add --no-cache dumb-init

# Crea utente non-root per sicurezza
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copia package files
COPY package*.json ./

# Installa solo dipendenze production
RUN npm ci --only=production && \
    npm cache clean --force

# Copia build artifacts da builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Crea directory uploads con permessi corretti
RUN mkdir -p /app/uploads && \
    chown -R nestjs:nodejs /app/uploads

# Switch a utente non-root
USER nestjs

# Esponi porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usa dumb-init per gestire PID 1
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/main.js"]
