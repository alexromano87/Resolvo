# RESOLVO - Guida Completa al Deployment in Produzione

> **Versione**: 1.0
> **Data**: Dicembre 2024
> **Autore**: Team RESOLVO
> **Tempo stimato setup**: 1-3 giorni lavorativi

---

## 📋 Indice

1. [Prerequisiti](#prerequisiti)
2. [Architettura di Deployment](#architettura-di-deployment)
3. [Scelta dell'Hosting](#scelta-dellhosting)
4. [Setup Database Remoto](#setup-database-remoto)
5. [Configurazione Storage S3](#configurazione-storage-s3)
6. [Preparazione Backend](#preparazione-backend)
7. [Preparazione Frontend](#preparazione-frontend)
8. [Deployment con Servizi Managed (Opzione A)](#opzione-a-deployment-managed)
9. [Deployment su VPS (Opzione B)](#opzione-b-deployment-vps)
10. [Configurazione DNS e SSL](#configurazione-dns-e-ssl)
11. [Backup e Disaster Recovery](#backup-e-disaster-recovery)
12. [Monitoring e Alerting](#monitoring-e-alerting)
13. [Sicurezza e Hardening](#sicurezza-e-hardening)
14. [Troubleshooting](#troubleshooting)
15. [Checklist Pre-Launch](#checklist-pre-launch)

---

## 📦 Prerequisiti

### Conoscenze Richieste
- [ ] Conoscenza base di Linux/Ubuntu
- [ ] Familiarità con Docker e Docker Compose
- [ ] Gestione DNS
- [ ] Concetti base di networking (porte, firewall, SSL)

### Account da Creare
- [ ] Dominio registrato (es. `resolvo.it`)
- [ ] Account GitHub/GitLab per repository
- [ ] Account provider hosting (vedere sezione scelta hosting)
- [ ] Account email service (SendGrid, AWS SES, o Mailgun)
- [ ] Account storage provider (AWS S3, DigitalOcean Spaces, o MinIO)

### Tools Necessari
```bash
# Installa sulla tua macchina locale
brew install docker docker-compose  # macOS
# oppure
sudo apt install docker.io docker-compose  # Linux

# Installa AWS CLI (se usi S3)
brew install awscli
aws configure

# Installa DigitalOcean CLI (opzionale)
brew install doctl
```

---

## 🏗️ Architettura di Deployment

```
┌─────────────────────────────────────────────────┐
│         CLOUDFLARE / CDN (Opzionale)            │
│         - Protezione DDoS                        │
│         - Cache statica                          │
│         - SSL Universale                         │
└──────────────────┬──────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
┌──────▼───────┐        ┌─────▼──────┐
│   FRONTEND   │        │  BACKEND   │
│   (Static)   │        │  (Node.js) │
│              │        │            │
│  Vercel /    │        │ Render /   │
│  Netlify     │        │ DO App     │
│              │        │ Platform   │
└──────────────┘        └─────┬──────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
         ┌────▼────┐     ┌────▼────┐    ┌────▼─────┐
         │ MySQL   │     │ Redis   │    │   S3     │
         │Database │     │ Cache   │    │ Storage  │
         │  RDS    │     │ Upstash │    │  Spaces  │
         └─────────┘     └─────────┘    └──────────┘
```

### Flusso delle Richieste

1. **Utente** → `app.resolvo.it` → **CDN** → **Frontend Statico**
2. **Frontend** → `api.resolvo.it` → **Backend API** → **Database/Cache/Storage**
3. **Backend** → Invia email via **SMTP** (SendGrid/SES)

---

## 🎯 Scelta dell'Hosting

### Opzione A: Servizi Managed (RACCOMANDATO per chi inizia)

**PRO:**
- ✅ Setup rapido (1-2 ore)
- ✅ Scaling automatico
- ✅ Backup inclusi
- ✅ SSL automatico
- ✅ Zero manutenzione server
- ✅ Deploy automatico da Git

**CONTRO:**
- ❌ Costo mensile più alto (~€80-120/mese)
- ❌ Meno controllo granulare

**Stack Consigliato:**

| Servizio | Provider | Costo/mese | Note |
|----------|----------|------------|------|
| Frontend | Vercel | Gratis - €20 | Deploy automatico, CDN globale |
| Backend | Render | €7 - €25 | Auto-scaling, health checks |
| Database | PlanetScale | €29 | MySQL serverless, backup automatici |
| Storage | DO Spaces | €5 | S3-compatible, 250GB inclusi |
| Cache | Upstash Redis | Gratis - €10 | Serverless, pay-per-request |
| Email | SendGrid | Gratis - €15 | 100 email/giorno gratis |
| **TOTALE** | | **€70-100** | |

### Opzione B: VPS Self-Managed

**PRO:**
- ✅ Costo fisso basso (€20-40/mese tutto incluso)
- ✅ Controllo totale
- ✅ Prestazioni dedicate

**CONTRO:**
- ❌ Richiede competenze DevOps
- ❌ Manutenzione manuale (aggiornamenti, backup)
- ❌ Setup più lungo (2-3 giorni)

**Provider VPS Consigliati:**

| Provider | RAM | CPU | Storage | Prezzo | Note |
|----------|-----|-----|---------|--------|------|
| **Hetzner** | 8GB | 2 vCPU | 160GB | €20/mese | Miglior rapporto qualità/prezzo |
| **DigitalOcean** | 4GB | 2 vCPU | 80GB | €24/mese | Ottima documentazione |
| **Contabo** | 8GB | 4 vCPU | 200GB | €10/mese | Più economico, supporto limitato |

---

## 🗄️ Setup Database Remoto

### Con PlanetScale (MySQL Serverless - RACCOMANDATO)

1. **Crea account**: https://planetscale.com
2. **Crea nuovo database**: `resolvo-production`
3. **Ottieni credenziali**:

```bash
# Nel dashboard PlanetScale, copia la stringa di connessione
# Esempio:
mysql://user:password@aws.connect.psdb.cloud/resolvo-production?ssl={"rejectUnauthorized":true}
```

4. **Importa schema iniziale**:

```bash
# Connettiti al database
mysql -h aws.connect.psdb.cloud -u user -p --ssl-mode=REQUIRED resolvo-production

# Importa lo schema (esegui localmente)
# Prima esporta dal tuo DB locale
mysqldump -u root -p recupero_crediti > schema.sql

# Poi importa su PlanetScale
mysql -h aws.connect.psdb.cloud -u user -p --ssl-mode=REQUIRED resolvo-production < schema.sql
```

### Con AWS RDS (MySQL Managed)

1. **Crea istanza RDS**:
   - Engine: MySQL 8.0
   - Istanza: db.t3.micro (gratis per 1 anno con Free Tier)
   - Storage: 20GB SSD
   - Backup: 7 giorni di retention

2. **Configurazione Sicurezza**:

```bash
# Security Group: Permetti solo IP del backend
Type: MySQL/Aurora (3306)
Source: <IP-BACKEND> o 0.0.0.0/0 (temporaneo per setup)
```

3. **Endpoint di connessione**:

```
Host: resolvo-db.xxxxxxxxx.eu-south-1.rds.amazonaws.com
Port: 3306
Username: admin
Password: <tua-password-sicura>
Database: resolvo_prod
```

### Con VPS (MySQL Self-Hosted)

```bash
# Su Ubuntu 22.04
sudo apt update
sudo apt install mysql-server

# Configura MySQL
sudo mysql_secure_installation

# Crea database e utente
sudo mysql
```

```sql
CREATE DATABASE resolvo_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'resolvo_user'@'%' IDENTIFIED BY 'password-sicura-qui';
GRANT ALL PRIVILEGES ON resolvo_prod.* TO 'resolvo_user'@'%';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Configura MySQL per connessioni remote
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Cambia: bind-address = 0.0.0.0

sudo systemctl restart mysql
```

---

## 📁 Configurazione Storage S3

### Con DigitalOcean Spaces (RACCOMANDATO - €5/mese)

1. **Crea Space**:
   - Nome: `resolvo-documents`
   - Regione: `fra1` (Frankfurt) o `ams3` (Amsterdam)
   - CDN: Abilitato
   - File Listing: Private

2. **Genera API Keys**:
   - API → Spaces Keys → Generate New Key
   - Salva `Access Key` e `Secret Key`

3. **Configurazione Environment**:

```env
STORAGE_TYPE=s3
S3_ENDPOINT=https://fra1.digitaloceanspaces.com
S3_REGION=fra1
S3_BUCKET=resolvo-documents
S3_ACCESS_KEY=<your-access-key>
S3_SECRET_KEY=<your-secret-key>
```

### Con AWS S3

1. **Crea bucket S3**:

```bash
aws s3 mb s3://resolvo-documents --region eu-south-1
```

2. **Configura CORS**:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://app.resolvo.it"],
    "ExposeHeaders": ["ETag"]
  }
]
```

3. **Crea IAM User con permessi S3**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::resolvo-documents",
        "arn:aws:s3:::resolvo-documents/*"
      ]
    }
  ]
}
```

---

## 🔧 Preparazione Backend

### 1. Crea File Environment

```bash
cd apps/backend
cp .env.example .env.production
```

**`apps/backend/.env.production`**:

```env
# ==========================================
# RESOLVO BACKEND - PRODUCTION ENVIRONMENT
# ==========================================

# Node Environment
NODE_ENV=production
PORT=3000

# Database Configuration (PlanetScale)
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_USERNAME=<planetscale-username>
DB_PASSWORD=<planetscale-password>
DB_NAME=resolvo-production
DB_SSL=true

# JWT Configuration
# Genera con: openssl rand -base64 32
JWT_SECRET=<genera-stringa-casuale-32-caratteri>
JWT_EXPIRES_IN=7d

# Frontend & Backend URLs
FRONTEND_URL=https://app.resolvo.it
BACKEND_URL=https://api.resolvo.it

# CORS Configuration
CORS_ORIGINS=https://app.resolvo.it,https://www.resolvo.it

# Email Service (SendGrid)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=<sendgrid-api-key>
EMAIL_FROM=noreply@resolvo.it
EMAIL_FROM_NAME=RESOLVO

# SMS Service (Twilio - OPZIONALE)
SMS_ENABLED=false
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=<your-account-sid>
TWILIO_AUTH_TOKEN=<your-auth-token>
TWILIO_PHONE_NUMBER=+39xxxxxxxxxx

# File Storage (DigitalOcean Spaces)
STORAGE_TYPE=s3
S3_ENDPOINT=https://fra1.digitaloceanspaces.com
S3_REGION=fra1
S3_BUCKET=resolvo-documents
S3_ACCESS_KEY=<your-access-key>
S3_SECRET_KEY=<your-secret-key>

# Redis Cache (Upstash)
REDIS_ENABLED=true
REDIS_HOST=<upstash-redis-host>
REDIS_PORT=6379
REDIS_PASSWORD=<upstash-password>
REDIS_TLS=true

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Logging & Monitoring
LOG_LEVEL=info
SENTRY_DSN=<sentry-dsn-optional>

# Session & Security
SESSION_SECRET=<genera-stringa-casuale-32-caratteri>
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
```

### 2. Installa Dipendenze Storage

```bash
cd apps/backend
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 3. Crea Service per Storage S3

**`apps/backend/src/common/storage/storage.service.ts`**:

```typescript
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET;

    this.s3Client = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
      forcePathStyle: false, // DigitalOcean Spaces compatibility
    });
  }

  /**
   * Upload file to S3
   * @param file - Multer file object
   * @param path - Storage path (es. 'documenti/pratica-id')
   * @returns S3 key
   */
  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${path}/${timestamp}-${sanitizedFilename}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private',
        Metadata: {
          'original-name': file.originalname,
          'upload-date': new Date().toISOString(),
        },
      }),
    );

    return key;
  }

  /**
   * Get temporary signed URL for private file
   * @param key - S3 key
   * @param expiresIn - URL expiration in seconds (default 1 hour)
   * @returns Signed URL
   */
  async getFileUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Delete file from S3
   * @param key - S3 key
   */
  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
```

**`apps/backend/src/common/storage/storage.module.ts`**:

```typescript
import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';

@Global()
@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
```

### 4. Modifica Documenti Service

**`apps/backend/src/documenti/documenti.service.ts`**:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './documento.entity';
import { StorageService } from '../common/storage/storage.service'; // Importa il service

@Injectable()
export class DocumentiService {
  constructor(
    @InjectRepository(Documento)
    private documentiRepository: Repository<Documento>,
    private storageService: StorageService, // Inietta il service
  ) {}

  async uploadDocumento(
    praticaId: string,
    file: Express.Multer.File,
    tipo: string,
    descrizione?: string,
  ): Promise<Documento> {
    // Upload su S3 invece di filesystem locale
    const fileKey = await this.storageService.uploadFile(
      file,
      `documenti/${praticaId}`,
    );

    const documento = this.documentiRepository.create({
      praticaId,
      nomeFile: file.originalname,
      percorsoFile: fileKey, // Salva la chiave S3 invece del path locale
      tipoDocumento: tipo,
      descrizione,
      dimensione: file.size,
      mimeType: file.mimetype,
    });

    return this.documentiRepository.save(documento);
  }

  async getDocumentoUrl(id: string): Promise<string> {
    const documento = await this.documentiRepository.findOne({ where: { id } });
    if (!documento) {
      throw new Error('Documento non trovato');
    }

    // Genera URL temporaneo (valido 1 ora)
    return this.storageService.getFileUrl(documento.percorsoFile);
  }

  async deleteDocumento(id: string): Promise<void> {
    const documento = await this.documentiRepository.findOne({ where: { id } });
    if (!documento) {
      throw new Error('Documento non trovato');
    }

    // Elimina da S3
    await this.storageService.deleteFile(documento.percorsoFile);

    // Elimina da database
    await this.documentiRepository.delete(id);
  }
}
```

### 5. Aggiorna App Module

**`apps/backend/src/app.module.ts`**:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { StorageModule } from './common/storage/storage.module'; // Aggiungi

@Module({
  imports: [
    // Database Configuration con SSL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // SEMPRE false in produzione
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: true,
      } : false,
      extra: {
        connectionLimit: 10,
      },
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
      limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    }]),

    // Storage S3
    StorageModule, // Aggiungi questo

    // ... altri moduli
  ],
})
export class AppModule {}
```

### 6. Aggiorna Main.ts per Produzione

**`apps/backend/src/main.ts`**:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // Compression
  app.use(compression());

  // CORS
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Prefix
  app.setGlobalPrefix('api');

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend running on port ${port} in ${process.env.NODE_ENV} mode`);
}

bootstrap();
```

### 7. Crea Dockerfile per Backend

**`apps/backend/Dockerfile`**:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copia codice sorgente
COPY . .

# Build
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Installa solo dipendenze di produzione
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copia build artifacts
COPY --from=builder /app/dist ./dist

# Crea utente non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001
USER nestjs

# Esponi porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start
CMD ["node", "dist/main.js"]
```

### 8. Crea Health Check Endpoint

**`apps/backend/src/health/health.controller.ts`**:

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 1500 }),
    ]);
  }
}
```

```bash
# Installa dipendenza
npm install @nestjs/terminus
```

---

## 🎨 Preparazione Frontend

### 1. Crea File Environment

**`apps/frontend/.env.production`**:

```env
VITE_API_URL=https://api.resolvo.it/api
VITE_APP_ENV=production
VITE_ENABLE_DEVTOOLS=false
```

### 2. Aggiorna Configurazione API

**`apps/frontend/src/api/config.ts`**:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const IS_PRODUCTION = import.meta.env.VITE_APP_ENV === 'production';
export const ENABLE_DEVTOOLS = import.meta.env.VITE_ENABLE_DEVTOOLS === 'true';

// Timeout configurazione
export const API_TIMEOUT = 30000; // 30 secondi

console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  environment: import.meta.env.VITE_APP_ENV,
  production: IS_PRODUCTION,
});
```

### 3. Ottimizza Vite Config per Produzione

**`apps/frontend/vite.config.ts`**:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    // Gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],

  build: {
    outDir: 'dist',
    sourcemap: false, // Disabilita sourcemap in produzione
    minify: 'terser',

    terserOptions: {
      compress: {
        drop_console: true, // Rimuovi console.log
        drop_debugger: true,
      },
    },

    rollupOptions: {
      output: {
        // Code splitting manuale
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react'],
          'vendor-charts': ['recharts'],
        },
      },
    },

    chunkSizeWarningLimit: 1000,
  },

  server: {
    port: 5173,
    host: true,
  },
});
```

### 4. Installa Dipendenze Build

```bash
cd apps/frontend
npm install -D vite-plugin-compression rollup-plugin-visualizer
```

### 5. Crea Dockerfile per Frontend

**`apps/frontend/Dockerfile`**:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copia codice sorgente
COPY . .

# Build con environment production
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine

# Copia build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configurazione nginx personalizzata
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Esponi porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

**`apps/frontend/nginx.conf`**:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Cache statico (immutable per file con hash)
    location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - tutte le richieste vanno a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Blocca accesso a file nascosti
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

---

## 🚀 Opzione A: Deployment Managed

### Setup Vercel (Frontend)

1. **Installa Vercel CLI**:

```bash
npm install -g vercel
```

2. **Login**:

```bash
vercel login
```

3. **Deploy da CLI**:

```bash
cd apps/frontend
vercel --prod
```

4. **Oppure collega GitHub**:
   - Vai su https://vercel.com/new
   - Importa repository
   - Framework: Vite
   - Root Directory: `apps/frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     ```
     VITE_API_URL=https://api.resolvo.it/api
     VITE_APP_ENV=production
     ```

5. **Configura dominio personalizzato**:
   - Settings → Domains → Add `app.resolvo.it`

### Setup Render (Backend)

1. **Crea account**: https://render.com

2. **Nuovo Web Service**:
   - Connect GitHub repository
   - Root Directory: `apps/backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/main.js`

3. **Environment Variables** (aggiungi tutte quelle del file `.env.production`):

```
NODE_ENV=production
PORT=3000
DB_HOST=...
DB_USERNAME=...
# ... (copia tutte le variabili)
```

4. **Health Check Path**: `/api/health`

5. **Custom Domain**: Settings → Custom Domain → `api.resolvo.it`

### Setup PlanetScale (Database)

Già configurato nella sezione Database.

### Setup Upstash Redis (Cache)

1. **Crea account**: https://upstash.com
2. **Nuovo database Redis**:
   - Region: `eu-central-1` (Frankfurt)
   - TLS: Enabled
3. **Copia credenziali**:
   ```
   REDIS_HOST=xxx.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=xxx
   ```

---

## 🖥️ Opzione B: Deployment VPS

### 1. Provisioning VPS

**Provider consigliato**: Hetzner Cloud

```bash
# Crea VPS tramite CLI (opzionale)
hcloud server create --name resolvo-prod --type cx21 --image ubuntu-22.04 --ssh-key my-key
```

**Oppure via dashboard**:
- Server Type: CX21 (2 vCPU, 4GB RAM, 40GB SSD) - €5.83/mese
- Location: Falkenstein (Germania) o Helsinki
- Image: Ubuntu 22.04 LTS
- SSH Keys: Aggiungi la tua chiave pubblica

### 2. Setup Iniziale VPS

```bash
# Connettiti al VPS
ssh root@<ip-vps>

# Aggiorna sistema
apt update && apt upgrade -y

# Installa Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installa Docker Compose
apt install docker-compose -y

# Crea utente non-root
adduser resolvo
usermod -aG sudo resolvo
usermod -aG docker resolvo

# Configura firewall
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Installa Nginx
apt install nginx -y
systemctl enable nginx
```

### 3. Clona Repository sul VPS

```bash
# Passa all'utente resolvo
su - resolvo

# Installa Git
sudo apt install git -y

# Clona repository (usa HTTPS con token o SSH)
git clone https://github.com/your-org/recupero-crediti.git /home/resolvo/app
cd /home/resolvo/app
```

### 4. Crea Docker Compose per Produzione

**`docker-compose.prod.yml`**:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: https://api.resolvo.it/api
    restart: always
    ports:
      - "3001:80"
    networks:
      - resolvo-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "3000:3000"
    env_file:
      - ./apps/backend/.env.production
    depends_on:
      - db
      - redis
    networks:
      - resolvo-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: resolvo_prod
      MYSQL_USER: resolvo_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - resolvo-network
    command: --default-authentication-plugin=mysql_native_password

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 256mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    networks:
      - resolvo-network
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:

networks:
  resolvo-network:
    driver: bridge
```

### 5. Configura Nginx Reverse Proxy

**`/etc/nginx/sites-available/resolvo`**:

```nginx
# Frontend - app.resolvo.it
server {
    listen 80;
    server_name app.resolvo.it;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API - api.resolvo.it
server {
    listen 80;
    server_name api.resolvo.it;

    # Aumenta dimensione max upload per documenti
    client_max_body_size 50M;
    client_body_timeout 300s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout per operazioni lunghe
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

```bash
# Abilita sito
sudo ln -s /etc/nginx/sites-available/resolvo /etc/nginx/sites-enabled/

# Testa configurazione
sudo nginx -t

# Ricarica Nginx
sudo systemctl reload nginx
```

### 6. Deploy Containers

```bash
cd /home/resolvo/app

# Crea file con password
echo "DB_ROOT_PASSWORD=password-root-sicura" > .env.docker
echo "DB_PASSWORD=password-user-sicura" >> .env.docker
echo "REDIS_PASSWORD=password-redis-sicura" >> .env.docker

# Build e avvia containers
docker-compose -f docker-compose.prod.yml --env-file .env.docker up -d --build

# Verifica status
docker-compose -f docker-compose.prod.yml ps

# Visualizza logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

### 7. Setup SSL con Let's Encrypt

```bash
# Installa Certbot
sudo apt install certbot python3-certbot-nginx -y

# Ottieni certificati SSL
sudo certbot --nginx -d app.resolvo.it -d api.resolvo.it --email your-email@example.com --agree-tos --non-interactive

# Auto-rinnovo (già configurato automaticamente)
sudo systemctl status certbot.timer
```

---

## 🌐 Configurazione DNS e SSL

### Configurazione DNS (su Cloudflare o provider DNS)

**Record da creare**:

```
Type    Name            Value               TTL     Proxy
A       @               <IP-VPS>            Auto    Proxied (se Cloudflare)
A       app             <IP-VPS>            Auto    Proxied
A       api             <IP-VPS>            Auto    DNS only (importante!)
CNAME   www             resolvo.it          Auto    Proxied
```

**Note importanti**:
- `api.resolvo.it` deve essere **DNS only** (no proxy) altrimenti certificato SSL fallirà
- Dopo aver ottenuto SSL, puoi abilitare proxy su `api` se usi Cloudflare

### Verifica DNS

```bash
# Testa risoluzione DNS
dig app.resolvo.it +short
dig api.resolvo.it +short

# Ping per verificare raggiungibilità
ping app.resolvo.it
ping api.resolvo.it
```

### Configurazione Cloudflare (Opzionale ma Raccomandato)

1. **Aggiungi sito**: `resolvo.it`
2. **Cambia nameserver** presso il tuo registrar con quelli di Cloudflare
3. **SSL/TLS Settings**:
   - Mode: **Full (strict)**
   - Edge Certificates: Enable
4. **Page Rules** (ottimizza cache):
   ```
   *app.resolvo.it/*
   - Cache Level: Cache Everything
   - Browser Cache TTL: 4 hours

   *api.resolvo.it/*
   - Cache Level: Bypass
   ```
5. **Firewall Rules**:
   ```
   # Blocca paesi ad alto rischio (opzionale)
   (ip.geoip.country ne "IT" and ip.geoip.country ne "CH")
   → Challenge
   ```

---

## 💾 Backup e Disaster Recovery

### Script Backup Automatico

**`/home/resolvo/scripts/backup.sh`**:

```bash
#!/bin/bash

# Configurazione
BACKUP_DIR="/home/resolvo/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7
S3_BUCKET="s3://resolvo-backups" # Opzionale

# Crea directory backup
mkdir -p ${BACKUP_DIR}

# Backup Database
echo "🗄️  Backup database..."
docker exec resolvo-db-1 mysqldump \
  -u root \
  -p${DB_ROOT_PASSWORD} \
  --single-transaction \
  --routines \
  --triggers \
  resolvo_prod | gzip > ${BACKUP_DIR}/db_${DATE}.sql.gz

# Backup Redis (RDB snapshot)
echo "📦 Backup Redis..."
docker exec resolvo-redis-1 redis-cli --pass ${REDIS_PASSWORD} SAVE
docker cp resolvo-redis-1:/data/dump.rdb ${BACKUP_DIR}/redis_${DATE}.rdb

# Backup configurazioni
echo "⚙️  Backup configurazioni..."
tar -czf ${BACKUP_DIR}/config_${DATE}.tar.gz \
  /home/resolvo/app/docker-compose.prod.yml \
  /home/resolvo/app/apps/backend/.env.production \
  /etc/nginx/sites-available/resolvo

# Rimuovi backup vecchi
echo "🧹 Pulizia backup vecchi (>${RETENTION_DAYS} giorni)..."
find ${BACKUP_DIR} -type f -mtime +${RETENTION_DAYS} -delete

# Upload su S3 (opzionale)
if [ ! -z "$S3_BUCKET" ]; then
  echo "☁️  Upload su S3..."
  aws s3 sync ${BACKUP_DIR} ${S3_BUCKET}/backups/ --storage-class STANDARD_IA
fi

# Calcola dimensione backup
TOTAL_SIZE=$(du -sh ${BACKUP_DIR} | cut -f1)
echo "✅ Backup completato! Dimensione totale: ${TOTAL_SIZE}"

# Notifica (opzionale - richiede sendmail configurato)
# echo "Backup completato con successo: ${TOTAL_SIZE}" | \
#   mail -s "RESOLVO Backup OK - ${DATE}" admin@resolvo.it
```

```bash
# Rendi eseguibile
chmod +x /home/resolvo/scripts/backup.sh
```

### Cron Job per Backup Automatico

```bash
# Apri crontab
crontab -e

# Aggiungi (backup ogni giorno alle 3:00 AM)
0 3 * * * /home/resolvo/scripts/backup.sh >> /home/resolvo/logs/backup.log 2>&1
```

### Procedura di Ripristino

**Ripristino Database**:

```bash
# Decomprimi backup
gunzip /home/resolvo/backups/db_20241220_030000.sql.gz

# Ripristina
docker exec -i resolvo-db-1 mysql \
  -u root \
  -p${DB_ROOT_PASSWORD} \
  resolvo_prod < /home/resolvo/backups/db_20241220_030000.sql
```

**Ripristino Redis**:

```bash
# Stop container
docker-compose -f docker-compose.prod.yml stop redis

# Copia RDB file
docker cp /home/resolvo/backups/redis_20241220_030000.rdb resolvo-redis-1:/data/dump.rdb

# Restart
docker-compose -f docker-compose.prod.yml start redis
```

---

## 📊 Monitoring e Alerting

### Uptime Monitoring con UptimeRobot

1. **Crea account**: https://uptimerobot.com (gratis fino a 50 monitor)

2. **Aggiungi monitor HTTP(S)**:
   ```
   Monitor Type: HTTPS
   Friendly Name: RESOLVO Frontend
   URL: https://app.resolvo.it
   Monitoring Interval: 5 minuti

   Monitor Type: HTTPS
   Friendly Name: RESOLVO Backend API
   URL: https://api.resolvo.it/api/health
   Monitoring Interval: 5 minuti
   ```

3. **Configura alerting**:
   - Alert Contacts: Email, SMS, Slack webhook
   - Trigger: Quando down per 2 minuti consecutivi

### Application Monitoring con Sentry

```bash
# Backend
cd apps/backend
npm install @sentry/node
```

**`apps/backend/src/main.ts`**:

```typescript
import * as Sentry from '@sentry/node';

async function bootstrap() {
  // Inizializza Sentry solo in produzione
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1, // Campiona 10% delle transazioni
      beforeSend(event, hint) {
        // Non loggare errori di validazione
        if (event.exception?.values?.[0]?.type === 'ValidationError') {
          return null;
        }
        return event;
      },
    });
  }

  // ... resto del codice
}
```

### Log Centralization con Logtail

```bash
# Installa Winston transport
npm install winston @logtail/node @logtail/winston
```

**`apps/backend/src/common/logger/logger.service.ts`**:

```typescript
import * as winston from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new LogtailTransport(logtail),
  ],
});
```

---

## 🔒 Sicurezza e Hardening

### 1. Fail2Ban (protezione da attacchi brute-force)

```bash
# Installa Fail2Ban
sudo apt install fail2ban -y

# Configura jail per SSH e Nginx
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port    = 22
logpath = /var/log/auth.log

[nginx-http-auth]
enabled  = true
port     = http,https
logpath  = /var/log/nginx/error.log

[nginx-limit-req]
enabled  = true
port     = http,https
logpath  = /var/log/nginx/error.log
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 2. SSH Hardening

```bash
sudo nano /etc/ssh/sshd_config
```

```
# Disabilita login root
PermitRootLogin no

# Solo autenticazione con chiave
PasswordAuthentication no
PubkeyAuthentication yes

# Disabilita login con password vuota
PermitEmptyPasswords no

# Timeout sessioni inattive
ClientAliveInterval 300
ClientAliveCountMax 2
```

```bash
sudo systemctl restart sshd
```

### 3. Automatic Security Updates

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 4. Database Security

```sql
-- Connettiti a MySQL
docker exec -it resolvo-db-1 mysql -u root -p

-- Rimuovi utenti anonimi
DELETE FROM mysql.user WHERE User='';

-- Disabilita root login remoto
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1');

-- Crea utente con permessi limitati per backup
CREATE USER 'backup_user'@'localhost' IDENTIFIED BY 'password-sicura';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON resolvo_prod.* TO 'backup_user'@'localhost';

FLUSH PRIVILEGES;
```

---

## 🛠️ Troubleshooting

### Backend non raggiungibile

```bash
# Verifica container attivo
docker ps | grep backend

# Visualizza logs
docker logs resolvo-backend-1 --tail 100 -f

# Testa connessione database
docker exec -it resolvo-backend-1 node -e "
const mysql = require('mysql2/promise');
mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).then(() => console.log('DB OK')).catch(err => console.error(err))
"
```

### Frontend mostra pagina bianca

```bash
# Verifica build completata
ls -la apps/frontend/dist/

# Controlla console browser (F12)
# Cerca errori API o CORS

# Verifica variabili environment
cat apps/frontend/.env.production
```

### Errore CORS

1. Verifica `CORS_ORIGINS` in backend `.env.production`
2. Assicurati che frontend faccia richieste a URL corretto
3. Controlla header `Origin` nelle richieste

```bash
# Test CORS con curl
curl -H "Origin: https://app.resolvo.it" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     --verbose \
     https://api.resolvo.it/api/auth/login
```

### Database connection refused

```bash
# Verifica MySQL attivo
docker exec resolvo-db-1 mysqladmin -u root -p ping

# Controlla porta esposta
docker port resolvo-db-1

# Testa connessione da backend container
docker exec -it resolvo-backend-1 nc -zv db 3306
```

### Upload documenti fallisce

1. Verifica credenziali S3 corrette
2. Controlla permessi bucket
3. Testa upload manuale:

```bash
# Da container backend
docker exec -it resolvo-backend-1 node -e "
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});
client.send(new PutObjectCommand({
  Bucket: process.env.S3_BUCKET,
  Key: 'test.txt',
  Body: 'test content'
})).then(() => console.log('Upload OK')).catch(console.error);
"
```

### SSL certificate expired

```bash
# Verifica certificati
sudo certbot certificates

# Rinnova manualmente
sudo certbot renew

# Testa rinnovo automatico
sudo certbot renew --dry-run
```

---

## ✅ Checklist Pre-Launch

### Configurazione

- [ ] Tutte le variabili environment configurate
- [ ] Database remoto testato e accessibile
- [ ] Storage S3 configurato con upload di prova
- [ ] Email service testato (invio email di prova)
- [ ] SSL/TLS attivo su tutti i domini
- [ ] DNS correttamente configurato

### Sicurezza

- [ ] JWT_SECRET generato in modo sicuro (32+ caratteri random)
- [ ] Password database complesse e uniche
- [ ] CORS configurato solo per domini autorizzati
- [ ] Rate limiting attivo
- [ ] Helmet security headers abilitati
- [ ] Fail2Ban configurato
- [ ] SSH hardened (no password, solo chiavi)
- [ ] Firewall attivo (ufw)

### Performance

- [ ] Frontend build ottimizzata (terser, compression)
- [ ] Code splitting abilitato
- [ ] Gzip/Brotli compression attiva
- [ ] CDN configurato (Cloudflare o simile)
- [ ] Database indexes creati
- [ ] Redis cache attivo

### Monitoring

- [ ] Uptime monitoring configurato (UptimeRobot)
- [ ] Error tracking attivo (Sentry)
- [ ] Log centralization configurato
- [ ] Health check endpoints testati
- [ ] Alerting via email/SMS configurato

### Backup

- [ ] Script backup automatico creato
- [ ] Cron job configurato (daily backup)
- [ ] Procedura ripristino testata
- [ ] Backup remoto su S3 configurato (opzionale)

### Testing

- [ ] Test end-to-end completati su staging
- [ ] Test carico API (load testing)
- [ ] Test mobile responsiveness
- [ ] Test cross-browser (Chrome, Firefox, Safari)
- [ ] Test workflow completo utenti

### Documentazione

- [ ] Credenziali documentate in password manager
- [ ] Procedura deployment documentata
- [ ] Contatti tecnici (hosting, DNS, email provider)
- [ ] Piano disaster recovery documentato

---

## 📞 Supporto e Risorse

### Documentazione Ufficiale

- **NestJS**: https://docs.nestjs.com/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Docker**: https://docs.docker.com/
- **Nginx**: https://nginx.org/en/docs/

### Community e Forum

- **Stack Overflow**: Tag `nestjs`, `react`, `docker`
- **NestJS Discord**: https://discord.gg/nestjs
- **React Discord**: https://discord.gg/react

### Servizi di Hosting Consigliati

- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs
- **DigitalOcean**: https://docs.digitalocean.com/
- **Hetzner**: https://docs.hetzner.com/

---

## 📝 Note Finali

Questa guida copre il deployment completo di RESOLVO in produzione. Per qualsiasi problema o dubbio, consulta la sezione [Troubleshooting](#troubleshooting) o contatta il team di sviluppo.

**Ricorda**:
- Testa sempre su ambiente staging prima di production
- Fai backup prima di ogni modifica importante
- Monitora le metriche dopo il deploy
- Mantieni documentate tutte le credenziali

**Buon deployment! 🚀**

---

*Ultimo aggiornamento: Dicembre 2024*
