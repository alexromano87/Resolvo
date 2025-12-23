# RESOLVO - Guida Deployment su AWS Lightsail (Testing)

Guida passo-passo per deployare RESOLVO su un'istanza Ubuntu AWS Lightsail per test e demo.

**IP Statico**: 3.120.81.201
**Scopo**: Testing/Demo (non production-ready)
**Architettura**: Single-server con Docker Compose

---

## 1. Prerequisiti

### 1.1 Accesso AWS Lightsail

Assicurati di avere:
- ✅ Istanza Ubuntu AWS Lightsail attiva
- ✅ IP statico assegnato: `3.120.81.201`
- ✅ Accesso SSH configurato
- ✅ Firewall rules configurate:
  - SSH (22)
  - HTTP (80)
  - HTTPS (443)
  - Custom TCP (3000) - Backend API
  - Custom TCP (5173) - Frontend Dev (opzionale)

### 1.2 Configurare Firewall su Lightsail

1. Vai su AWS Lightsail Console
2. Seleziona la tua istanza
3. Vai su **Networking** > **Firewall**
4. Aggiungi le seguenti regole se non presenti:

```
Application     Protocol    Port range
SSH             TCP         22
HTTP            TCP         80
HTTPS           TCP         443
Custom          TCP         3000
Custom          TCP         5173 (opzionale)
```

---

## 2. Connessione al Server

### 2.1 Connessione SSH

```bash
# Opzione 1: Usando la chiave SSH di Lightsail
ssh -i /path/to/LightsailDefaultKey.pem ubuntu@3.120.81.201

# Opzione 2: Se hai configurato password/chiave custom
ssh ubuntu@3.120.81.201
```

### 2.2 Aggiornamento Sistema

```bash
# Aggiorna il sistema
sudo apt update && sudo apt upgrade -y

# Installa utility essenziali
sudo apt install -y git curl wget vim htop ufw
```

---

## 3. Installazione Docker e Docker Compose

### 3.1 Installazione Docker

```bash
# Rimuovi eventuali versioni vecchie
sudo apt remove docker docker-engine docker.io containerd runc

# Installa dipendenze
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Aggiungi chiave GPG ufficiale Docker
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Setup repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installa Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verifica installazione
sudo docker --version
sudo docker compose version
```

### 3.2 Configurazione Docker per User Corrente

```bash
# Aggiungi utente al gruppo docker
sudo usermod -aG docker $USER

# Applica i cambiamenti (logout/login o usa newgrp)
newgrp docker

# Verifica che funzioni senza sudo
docker ps
```

### 3.3 Avvia Docker all'avvio

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

---

## 4. Installazione Node.js (per build frontend)

```bash
# Installa Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifica installazione
node --version
npm --version
```

---

## 5. Clone del Progetto

### 5.1 Generare SSH Key per GitHub (se repository privato)

```bash
# Genera chiave SSH
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copia la chiave pubblica
cat ~/.ssh/id_ed25519.pub

# Aggiungi questa chiave a GitHub:
# GitHub > Settings > SSH and GPG keys > New SSH key
```

### 5.2 Clone Repository

```bash
# Vai nella home directory
cd ~

# Clone del progetto (sostituisci con il tuo repository)
git clone git@github.com:your-username/recupero-crediti.git

# Oppure se pubblico o con HTTPS
git clone https://github.com/your-username/recupero-crediti.git

# Entra nella directory
cd recupero-crediti
```

**NOTA**: Se il progetto è sulla tua macchina locale, puoi trasferirlo con:

```bash
# Dalla tua macchina locale
rsync -avz -e "ssh -i /path/to/key.pem" \
  /path/to/local/recupero-crediti \
  ubuntu@3.120.81.201:~/
```

---

## 6. Configurazione Environment Variables

### 6.1 Backend Environment

```bash
# Crea file .env per backend
cd ~/recupero-crediti/apps/backend
nano .env
```

Inserisci il seguente contenuto:

```env
# Database Configuration
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=rc_user
DB_PASSWORD=rc_pass_CHANGE_ME_123!
DB_DATABASE=recupero_crediti

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-CHANGE-ME-min-32-chars!
JWT_EXPIRATION=7d

# Application
NODE_ENV=production
PORT=3000
FRONTEND_URL=http://3.120.81.201

# Upload Configuration
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760

# Email Configuration (opzionale per testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@resolvo.com

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
```

**IMPORTANTE**:
- Cambia `DB_PASSWORD` con una password sicura
- Cambia `JWT_SECRET` con una stringa random di almeno 32 caratteri
- Se usi email, configura SMTP o rimuovi la sezione

### 6.2 Frontend Environment

```bash
# Crea file .env per frontend
cd ~/recupero-crediti/apps/frontend
nano .env
```

Inserisci:

```env
VITE_API_URL=http://3.120.81.201:3000
VITE_APP_NAME=RESOLVO
```

---

## 7. Docker Compose Setup

### 7.1 Crea Docker Compose File

```bash
cd ~/recupero-crediti
nano docker-compose.yml
```

Inserisci il seguente contenuto:

```yaml
version: '3.8'

services:
  # Database MySQL
  mysql:
    image: mysql:8.0
    container_name: resolvo-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root_password_CHANGE_ME
      MYSQL_DATABASE: recupero_crediti
      MYSQL_USER: rc_user
      MYSQL_PASSWORD: rc_pass_CHANGE_ME_123!
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - resolvo-network
    command: --default-authentication-plugin=mysql_native_password

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: resolvo-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - resolvo-network

  # Backend NestJS
  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    container_name: resolvo-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./apps/backend/uploads:/app/uploads
    depends_on:
      - mysql
      - redis
    networks:
      - resolvo-network

  # Frontend React
  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
    container_name: resolvo-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - resolvo-network

volumes:
  mysql_data:
  redis_data:

networks:
  resolvo-network:
    driver: bridge
```

**IMPORTANTE**: Cambia `MYSQL_ROOT_PASSWORD` e `MYSQL_PASSWORD` con password sicure!

### 7.2 Crea Dockerfile per Backend

```bash
cd ~/recupero-crediti/apps/backend
nano Dockerfile
```

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze
RUN npm ci

# Copia source code
COPY . .

# Build dell'applicazione
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa solo dipendenze production
RUN npm ci --only=production

# Copia build artifacts
COPY --from=builder /app/dist ./dist

# Crea directory uploads
RUN mkdir -p uploads

# Esponi porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/main.js"]
```

### 7.3 Crea Dockerfile per Frontend

```bash
cd ~/recupero-crediti/apps/frontend
nano Dockerfile
```

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze
RUN npm ci

# Copia source code e assets
COPY . .

# Build production
RUN npm run build

# Production image con Nginx
FROM nginx:alpine

# Copia build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configurazione Nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Esponi porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### 7.4 Crea Configurazione Nginx per Frontend

```bash
cd ~/recupero-crediti/apps/frontend
nano nginx.conf
```

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router - SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

---

## 8. Build e Deploy

### 8.1 Installa Dipendenze

```bash
# Backend
cd ~/recupero-crediti/apps/backend
npm install

# Frontend
cd ~/recupero-crediti/apps/frontend
npm install
```

### 8.2 Build con Docker Compose

```bash
cd ~/recupero-crediti

# Build di tutte le immagini
docker compose build

# Questo processo può richiedere 5-10 minuti
```

### 8.3 Avvia i Servizi

```bash
# Avvia tutti i container in background
docker compose up -d

# Verifica che siano running
docker compose ps

# Output atteso:
# NAME                 IMAGE                    STATUS
# resolvo-mysql        mysql:8.0                Up
# resolvo-redis        redis:7-alpine           Up
# resolvo-backend      recupero-crediti-backend Up
# resolvo-frontend     recupero-crediti-frontend Up
```

### 8.4 Verifica Logs

```bash
# Logs di tutti i servizi
docker compose logs -f

# Logs specifici
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql

# Per uscire: CTRL+C
```

---

## 9. Inizializzazione Database

### 9.1 Attendi Che MySQL Sia Pronto

```bash
# Verifica che MySQL sia pronto
docker compose exec mysql mysql -urc_user -prc_pass_CHANGE_ME_123! -e "SELECT 1"

# Se ricevi errore, attendi qualche secondo e riprova
```

### 9.2 Esegui Migrazioni (se presenti)

```bash
# Se hai migration scripts
docker compose exec backend npm run migration:run

# Oppure manualmente con TypeORM CLI
docker compose exec backend npx typeorm migration:run -d dist/config/database.config.js
```

### 9.3 Seed Dati Iniziali (opzionale)

Se hai uno script di seed per creare admin iniziale:

```bash
docker compose exec backend npm run seed:admin
```

Oppure crea manualmente l'admin via MySQL:

```bash
docker compose exec mysql mysql -urc_user -prc_pass_CHANGE_ME_123! recupero_crediti

# Dentro MySQL console
INSERT INTO users (id, email, password, nome, cognome, ruolo, studio_id, attivo, created_at, updated_at)
VALUES (
  UUID(),
  'admin@test.com',
  '$2b$10$XQ.V7K8QYh5jGdYqB5pSHO8xqKL5C2Kv1Yz5QZQZQZQZQZQZQZQZQ', -- password: Admin123!
  'Admin',
  'Sistema',
  'admin',
  NULL,
  1,
  NOW(),
  NOW()
);
```

**NOTA**: La password hashata sopra è un esempio. Genera la tua con:

```bash
# Genera password hash bcrypt
docker compose exec backend node -e "const bcrypt = require('bcrypt'); bcrypt.hash('TuaPassword123!', 10).then(console.log)"
```

---

## 10. Verifica Deployment

### 10.1 Test Backend API

```bash
# Test health endpoint
curl http://3.120.81.201:3000/health

# Test login API
curl -X POST http://3.120.81.201:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'

# Dovrebbe restituire un JWT token
```

### 10.2 Test Frontend

Apri il browser e vai a:

```
http://3.120.81.201
```

Dovresti vedere la pagina di login di RESOLVO.

### 10.3 Verifica Container Status

```bash
# Verifica che tutti i container siano healthy
docker ps

# Verifica risorse utilizzate
docker stats

# Verifica networks
docker network ls
docker network inspect recupero-crediti_resolvo-network
```

---

## 11. Gestione Applicazione

### 11.1 Comandi Docker Compose Utili

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Restart services
docker compose restart

# Restart specific service
docker compose restart backend

# View logs
docker compose logs -f [service-name]

# Rebuild after code changes
docker compose build [service-name]
docker compose up -d [service-name]

# Execute command in container
docker compose exec backend sh
docker compose exec mysql mysql -urc_user -p

# View container resource usage
docker compose stats
```

### 11.2 Backup Database

```bash
# Backup completo
docker compose exec mysql mysqldump -urc_user -prc_pass_CHANGE_ME_123! recupero_crediti > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup con compressione
docker compose exec mysql mysqldump -urc_user -prc_pass_CHANGE_ME_123! recupero_crediti | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Ripristino
docker compose exec -T mysql mysql -urc_user -prc_pass_CHANGE_ME_123! recupero_crediti < backup_20250101_120000.sql
```

### 11.3 Backup Uploads

```bash
# Backup directory uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz ~/recupero-crediti/apps/backend/uploads/

# Ripristino
tar -xzf uploads_backup_20250101.tar.gz -C ~/recupero-crediti/apps/backend/
```

---

## 12. Troubleshooting

### 12.1 Container Non Si Avvia

```bash
# Verifica logs dettagliati
docker compose logs backend

# Verifica configurazione
docker compose config

# Rimuovi container e ricrea
docker compose down
docker compose up -d

# Rimuovi anche volumes (ATTENZIONE: cancella dati)
docker compose down -v
```

### 12.2 Errore Connessione Database

```bash
# Verifica che MySQL sia pronto
docker compose exec mysql mysql -uroot -proot_password_CHANGE_ME -e "SELECT 1"

# Verifica network
docker compose exec backend ping mysql

# Verifica variabili ambiente backend
docker compose exec backend env | grep DB_
```

### 12.3 Frontend Non Carica

```bash
# Verifica logs Nginx
docker compose logs frontend

# Verifica file build
docker compose exec frontend ls -la /usr/share/nginx/html/

# Test diretto Nginx
docker compose exec frontend wget -O- http://localhost:80

# Verifica chiamate API
docker compose exec frontend cat /etc/nginx/conf.d/default.conf
```

### 12.4 Problemi Performance

```bash
# Verifica risorse
docker stats

# Verifica disk space
df -h

# Verifica memoria
free -h

# Cleanup Docker
docker system prune -a --volumes
```

### 12.5 Errori CORS

Se ricevi errori CORS, verifica:

```bash
# Backend: verifica CORS configuration
docker compose exec backend grep -r "cors" src/main.ts

# Assicurati che FRONTEND_URL in .env sia corretto
docker compose exec backend env | grep FRONTEND_URL
```

Aggiungi in `apps/backend/src/main.ts`:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://3.120.81.201',
  credentials: true,
});
```

---

## 13. Aggiornamento Applicazione

### 13.1 Deploy Nuove Modifiche

```bash
# 1. Connettiti al server
ssh ubuntu@3.120.81.201

# 2. Vai nella directory progetto
cd ~/recupero-crediti

# 3. Pull ultime modifiche (se da Git)
git pull origin main

# 4. Rebuild services modificati
docker compose build backend frontend

# 5. Restart services
docker compose up -d

# 6. Verifica logs
docker compose logs -f backend frontend
```

### 13.2 Zero-Downtime Deployment (Avanzato)

Per deployment senza downtime, usa Blue-Green deployment:

```bash
# Build nuova versione
docker compose build

# Start nuovi container con nome diverso
docker compose -p resolvo-new up -d

# Testa nuova versione
curl http://localhost:3001/health

# Se ok, switch traffic (cambia porta in Nginx)
# Poi rimuovi vecchia versione
docker compose -p resolvo-old down
```

---

## 14. Monitoring e Logs

### 14.1 Monitoraggio Real-time

```bash
# Monitor tutti i container
docker stats

# Monitor logs in tempo reale
docker compose logs -f --tail=100

# Monitor specifico service
docker compose logs -f backend --tail=50
```

### 14.2 Setup Logrotate

```bash
# Crea configurazione logrotate
sudo nano /etc/logrotate.d/docker-resolvo
```

Inserisci:

```
/var/lib/docker/containers/*/*.log {
  rotate 7
  daily
  compress
  size=10M
  missingok
  delaycompress
  copytruncate
}
```

### 14.3 Alert Automatici (Opzionale)

Installa `monitoring-simple`:

```bash
# Crea script monitoring
nano ~/monitor-resolvo.sh
```

```bash
#!/bin/bash
if ! docker compose ps | grep -q "Up"; then
    echo "RESOLVO containers are down!" | mail -s "ALERT: RESOLVO Down" your-email@example.com
fi
```

```bash
# Rendi eseguibile
chmod +x ~/monitor-resolvo.sh

# Aggiungi a crontab (check ogni 5 minuti)
crontab -e
*/5 * * * * /home/ubuntu/monitor-resolvo.sh
```

---

## 15. Security Checklist per Testing

Anche per testing, applica queste misure base:

- [ ] Password database cambiate da default
- [ ] JWT_SECRET cambiato con valore random
- [ ] Firewall configurato (solo porte necessarie)
- [ ] SSH con chiave (non password)
- [ ] Aggiornamenti sistema applicati
- [ ] Backup database configurato
- [ ] Logs monitorati
- [ ] Container restart policy configurato
- [ ] File .env non committati in Git

---

## 16. FAQ

**Q: Come accedo al database?**
```bash
docker compose exec mysql mysql -urc_user -prc_pass_CHANGE_ME_123! recupero_crediti
```

**Q: Come vedo i file uploads?**
```bash
ls -la ~/recupero-crediti/apps/backend/uploads/
```

**Q: Come resetto tutto?**
```bash
docker compose down -v  # ATTENZIONE: cancella dati
docker compose up -d
```

**Q: Come cambio le porte?**
Modifica `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Frontend su porta 8080
  - "3001:3000"  # Backend su porta 3001
```

**Q: Come abilito HTTPS?**
Segui la sezione SSL/TLS nel file `DEPLOYMENT-GUIDE.md` principale.

---

## 17. Comandi Rapidi Cheat Sheet

```bash
# Deploy iniziale
docker compose up -d

# Restart tutto
docker compose restart

# Rebuild dopo modifiche codice
docker compose build && docker compose up -d

# Logs
docker compose logs -f

# Backup DB
docker compose exec mysql mysqldump -urc_user -p recupero_crediti > backup.sql

# Accesso MySQL
docker compose exec mysql mysql -urc_user -p recupero_crediti

# Accesso container backend
docker compose exec backend sh

# Stop tutto
docker compose down

# Clean completo (ATTENZIONE: cancella dati)
docker compose down -v && docker system prune -a
```

---

## 18. Prossimi Passi

Dopo aver completato il deployment di test:

1. **Test Funzionalità**: Testa tutte le funzionalità con colleghi
2. **Raccolta Feedback**: Documenta bug e miglioramenti
3. **Performance Testing**: Verifica performance con carico reale
4. **Security Review**: Prima di production, applica hardening da `DEPLOYMENT-GUIDE.md`
5. **DNS + SSL**: Configura dominio e certificato SSL per production
6. **Distributed Architecture**: Separa servizi per scalabilità

---

## Supporto

Per problemi o domande:
- GitHub Issues: [repository-url]/issues
- Email: support@resolvo.com
- Documentazione completa: `DEPLOYMENT-GUIDE.md`

---

**Ultima modifica**: 2025-12-23
**Versione**: 1.0.0
**Target**: AWS Lightsail Ubuntu Testing Environment
