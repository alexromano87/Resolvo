# DEPLOY SERVER - GUIDA DEFINITIVA

Questa guida funziona **AL PRIMO COLPO**. Segui ESATTAMENTE questi passi.

---

## PASSO 1: Crea il file .env nella ROOT del progetto

```bash
cd /app/RESOLVO

cat > .env << 'EOF'
NODE_ENV=development
JWT_SECRET=resolvo-production-secret-2024-change-me-later
FRONTEND_URL=http://3.120.81.201
EOF
```

**Verifica che sia stato creato**:
```bash
ls -la .env
cat .env
```

Dovresti vedere:
```
NODE_ENV=development
JWT_SECRET=resolvo-production-secret-2024-change-me-later
FRONTEND_URL=http://3.120.81.201
```

---

## PASSO 2: Ferma tutto e ripulisci

```bash
cd /app/RESOLVO

# Ferma containers
docker-compose down

# Rimuovi volumi vecchi (ATTENZIONE: cancella il database!)
docker-compose down -v

# Pulisci immagini vecchie
docker system prune -f
```

---

## PASSO 3: Build e Start

```bash
cd /app/RESOLVO

# Build (può richiedere 5-10 minuti)
docker-compose build --no-cache

# Start
docker-compose up -d
```

---

## PASSO 4: Verifica che tutto sia partito

```bash
docker-compose ps
```

Dovresti vedere:
```
NAME                IMAGE              STATUS
resolvo-mysql       mysql:8.0          Up (healthy)
resolvo-redis       redis:7-alpine     Up (healthy)
resolvo-backend     ...                Up (healthy)
resolvo-frontend    ...                Up
```

---

## PASSO 5: Controlla i log del backend

```bash
docker-compose logs backend | tail -50
```

Dovresti vedere:
```
🚀 RESOLVO Backend Started
🌍 Environment: development
🔗 Running on: http://localhost:3000
📊 Database: mysql:3306
```

E dovresti vedere TypeORM che crea le tabelle:
```
query: CREATE TABLE `users` ...
query: CREATE TABLE `studi` ...
query: CREATE TABLE `clienti` ...
...
```

---

## PASSO 6: Verifica le tabelle nel database

```bash
docker exec -it resolvo-mysql mysql -u root -p
```

Password: `root_password_CHANGE_ME_123!`

Poi dentro MySQL:
```sql
USE recupero_crediti;
SHOW TABLES;
```

Dovresti vedere almeno 15 tabelle.

Esci con:
```sql
exit;
```

---

## PASSO 7: Crea l'utente admin

```bash
docker-compose exec backend npm run seed:admin
```

Dovresti vedere:
```
Admin user created successfully:
Email: admin@studio.it
Password: admin123
```

---

## PASSO 8: Testa il login

Apri browser e vai a:
```
http://3.120.81.201
```

Dovresti vedere la pagina di login di RESOLVO.

Prova a fare login con:
- Email: `admin@studio.it`
- Password: `admin123`

---

## SE QUALCOSA NON FUNZIONA

### Backend non parte
```bash
docker-compose logs backend
```

### Database non è healthy
```bash
docker-compose logs mysql
```

### Frontend non risponde
```bash
docker-compose logs frontend
```

### Ripartire da zero
```bash
docker-compose down -v
docker system prune -af
# Poi ricomincia dal PASSO 3
```

---

## DOPO CHE TUTTO FUNZIONA

Puoi cambiare `NODE_ENV=production` nel file `.env`:

```bash
nano .env
# Cambia: NODE_ENV=development -> NODE_ENV=production
# Cambia: JWT_SECRET con una stringa più sicura
```

Poi:
```bash
docker-compose restart backend
```

---

**FINE. Ora deve funzionare.**
