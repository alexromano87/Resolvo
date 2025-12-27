# Resolvo — Guida Operativa Docker (Ubuntu / Lightsail)

Questa guida raccoglie procedure pratiche per:
- vedere/avviare/riavviare container
- risolvere errori tipici (porte occupate, iptables/DOCKER-ISOLATION, Nginx)
- gestire MySQL (import schema, controllo record admin, backup tabella `users`)
- impostare riavvio automatico dei container dopo reboot del server
- evitare perdita dati (volumi, comandi “pericolosi”)

> Percorso progetto (assunto): `/home/ubuntu/app/Resolvo`  
> Stack tipico: `resolvo-frontend` (nginx), `resolvo-backend` (Nest/TypeORM), `resolvo-mysql` (MySQL 8), `resolvo-redis` (Redis)

---

## 1) Comandi base Docker / Compose

### 1.1 Vedere container
```bash
docker ps            # solo in esecuzione
docker ps -a         # tutti (anche stopped/created)
```

### 1.2 Stato + porte in modo leggibile
```bash
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
```

### 1.3 Log
```bash
docker logs -n 200 resolvo-backend
docker logs -f resolvo-backend
```

### 1.4 Entrare in un container
```bash
docker exec -it resolvo-backend sh
docker exec -it resolvo-mysql sh
```

### 1.5 Compose (consigliato)
```bash
cd ~/app/Resolvo

docker compose up -d          # avvia in background
docker compose ps             # stato servizi
docker compose logs -f        # logs in follow
docker compose restart        # restart stack
docker compose down           # stop + rimuove container (NON cancella volumi)
```

> ⚠️ **NON usare** `docker compose down -v` se non vuoi perdere dati MySQL (cancella i volumi).

---

## 2) Problema: “address already in use” (porte occupate)

Errore tipico:
- `failed to bind host port ... address already in use`

### 2.1 Verifica chi usa le porte
Esempio per 3000, 6379, 3306:
```bash
sudo ss -lptn | egrep ':(3000|6379|3306)\b' || true
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

### 2.2 Soluzioni rapide
- Se è un altro container: `docker stop <nome>`
- Se è un servizio host (mysql/redis):
  ```bash
  sudo systemctl stop mysql 2>/dev/null || true
  sudo systemctl stop redis-server 2>/dev/null || true
  ```
- Alternativa: cambia mapping porte in compose (es. `3307:3306`).

---

## 3) Problema: iptables / DOCKER-ISOLATION-STAGE-2 non esiste

Errore:
- `Chain 'DOCKER-ISOLATION-STAGE-2' does not exist`

Tipico dopo reset/flush iptables.

### Fix rapido (ricreazione chain + restart docker)
```bash
sudo iptables -t filter -N DOCKER-ISOLATION-STAGE-1 2>/dev/null || true
sudo iptables -t filter -N DOCKER-ISOLATION-STAGE-2 2>/dev/null || true

sudo iptables -t filter -C DOCKER-ISOLATION-STAGE-1 -j DOCKER-ISOLATION-STAGE-2 2>/dev/null \
  || sudo iptables -t filter -A DOCKER-ISOLATION-STAGE-1 -j DOCKER-ISOLATION-STAGE-2

sudo iptables -t filter -C DOCKER-ISOLATION-STAGE-2 -j RETURN 2>/dev/null \
  || sudo iptables -t filter -A DOCKER-ISOLATION-STAGE-2 -j RETURN

sudo iptables -t filter -C FORWARD -j DOCKER-ISOLATION-STAGE-1 2>/dev/null \
  || sudo iptables -t filter -I FORWARD 2 -j DOCKER-ISOLATION-STAGE-1

sudo systemctl restart docker
```

Verifica:
```bash
sudo iptables -S | grep DOCKER-ISOLATION || true
```

---

## 4) Problema: frontend (nginx) in restart loop

Errore tipico:
- `nginx: [emerg] unknown directive ... in /etc/nginx/conf.d/default.conf:1`

Causa comune: `default.conf` generato male (es. contiene `\n` letterali o virgolette).

### 4.1 Controllare config nel container
```bash
docker logs -n 80 resolvo-frontend
docker run --rm --entrypoint sh resolvo-frontend -c 'sed -n "1,30p" /etc/nginx/conf.d/default.conf'
```

### 4.2 Fix robusto nel Dockerfile
❌ NON fare:
```dockerfile
RUN echo 'server {\n ... }' > /etc/nginx/conf.d/default.conf
```

✅ Fai un heredoc:
```dockerfile
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / { try_files $uri $uri/ /index.html; }
}
EOF
```

Rebuild:
```bash
cd ~/app/Resolvo
docker compose build --no-cache frontend
docker compose up -d --force-recreate frontend
```

---

## 5) MySQL: accesso, verifica tabelle, record admin

### 5.1 Entrare nel MySQL del container
```bash
docker exec -it resolvo-mysql mysql -u root -p
```

### 5.2 DB e tabelle
Dentro MySQL:
```sql
SHOW DATABASES;
USE recupero_crediti;
SHOW TABLES;
```

### 5.3 Verificare record admin
Se tabella `users`:
```sql
SELECT id, email
FROM users
WHERE email='admin@studio.it'
LIMIT 5;
```

Se non conosci tabella/colonna email:
```sql
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND column_name LIKE '%email%';
```

---

## 6) Import schema SQL (creare tabelle)

Se hai lo script `create-database-schema.sql` sul server, importalo così **dall’host** (non con `source` dentro MySQL):

```bash
cd ~/app/Resolvo

# crea DB se non esiste
docker exec -i resolvo-mysql mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS recupero_crediti;"

# importa schema nel DB
docker exec -i resolvo-mysql mysql -u root -p recupero_crediti < create-database-schema.sql
```

Verifica:
```bash
docker exec -i resolvo-mysql mysql -u root -p recupero_crediti -e "SHOW TABLES;"
```

> Nota: `source /path/file.sql` dentro MySQL funziona **solo** se il file esiste **dentro il container**.

---

## 7) Seed admin: errori tipici e fix

### 7.1 Errore: prova a connettersi a 127.0.0.1:3307
Causa: stai eseguendo seed sull’host con env sbagliate.  
Nel container backend (docker) i parametri corretti devono essere (esempio reale):
- `DB_HOST=mysql`
- `DB_PORT=3306`
- `DB_DATABASE=recupero_crediti`
- `DB_USERNAME=rc_user`
- `DB_PASSWORD=rc_pass`

Verifica nel container:
```bash
docker exec -it resolvo-backend sh -lc 'env | egrep -i "DB_|MYSQL|DATABASE|TYPEORM|HOST|PORT"'
```

### 7.2 Errore: "Cannot find module ./seed-admin.ts"
Causa: l’immagine backend non include i sorgenti TS (`src/`). Quindi `ts-node` non può girare nel container “prod”.

Soluzioni:
- eseguire seed compilato (JS) se presente in `dist/`
- oppure montare i sorgenti nel container (modalità dev)
- oppure eseguire seed sull’host ma puntando al DB corretto.

Ricerca seed nel container:
```bash
docker exec -it resolvo-backend sh -lc 'find /app -maxdepth 6 -type f -iname "*seed*admin*" 2>/dev/null'
```

---

## 8) Backup tabella `users` (db `recupero_crediti`)

### 8.1 Dump completo (schema + dati)
Con MySQL 8 è comune l’errore `PROCESS privilege` → usare `--no-tablespaces`.

```bash
cd ~/app/Resolvo
docker exec resolvo-mysql sh -lc \
'mysqldump --no-tablespaces -u rc_user -prc_pass recupero_crediti users' \
> users_$(date +%F_%H%M).sql
```

Verifica file:
```bash
ls -lah users_*.sql
head -n 20 users_*.sql
```

### 8.2 Solo dati / solo struttura
Solo dati:
```bash
docker exec resolvo-mysql sh -lc \
'mysqldump --no-tablespaces -u rc_user -prc_pass --no-create-info recupero_crediti users' \
> users_data_$(date +%F_%H%M).sql
```

Solo struttura:
```bash
docker exec resolvo-mysql sh -lc \
'mysqldump --no-tablespaces -u rc_user -prc_pass --no-data recupero_crediti users' \
> users_schema_$(date +%F_%H%M).sql
```

---

## 9) Leggere il contenuto del backup

### 9.1 Come testo
```bash
head -n 50 users_*.sql
tail -n 50 users_*.sql
less users_*.sql
grep -n "admin@studio.it" users_*.sql
grep -n "CREATE TABLE" users_*.sql
```

### 9.2 Import in DB temporaneo (per fare SELECT)
```bash
# crea DB test
docker exec -i resolvo-mysql mysql -u root -p -e "DROP DATABASE IF EXISTS backup_test; CREATE DATABASE backup_test;"

# importa
docker exec -i resolvo-mysql mysql -u root -p backup_test < users_YYYY-MM-DD_HHMM.sql

# query
docker exec -i resolvo-mysql mysql -u root -p backup_test -e "SHOW TABLES;"
docker exec -i resolvo-mysql mysql -u root -p backup_test -e "SELECT id,email FROM users LIMIT 20;"
```

---

## 10) Ripristino tabella `users` da dump

> ⚠️ Se il dump contiene `DROP TABLE` / `CREATE TABLE`, sovrascriverà la tabella.

Ripristino nel DB originale:
```bash
docker exec -i resolvo-mysql mysql -u rc_user -prc_pass recupero_crediti < users_YYYY-MM-DD_HHMM.sql
```

---

## 11) Aggiornare password admin (bcrypt)

Se in DB vedi password tipo `$2b$10$...` allora è bcrypt e **non è reversibile**.
Devi scrivere un **nuovo hash**.

### 11.1 Generare hash bcrypt dal backend (se disponibile)
Prova (dipende dai moduli installati):
```bash
docker exec -it resolvo-backend node -e "const b=require('bcryptjs'); console.log(b.hashSync('NUOVA_PASSWORD', 10));"
```

Se `bcryptjs` non esiste, prova:
```bash
docker exec -it resolvo-backend node -e "const b=require('bcrypt'); b.hash('NUOVA_PASSWORD',10).then(console.log)"
```

### 11.2 Update record (esempio tabella users)
Dentro MySQL:
```sql
USE recupero_crediti;
UPDATE users
SET password = '<HASH_BCRYPT_GENERATO>'
WHERE email = 'admin@studio.it';
```

Verifica:
```sql
SELECT id,email,LENGTH(password) len,password FROM users WHERE email='admin@studio.it';
```

---

## 12) Perché “sono sparite tutte le tabelle”?

Cause più comuni:
1. `docker compose down -v` (cancella volumi)
2. rimozione `/var/lib/docker` o reinstall Docker “con wipe”
3. cambio nome progetto/compose → nuovo volume (DB vuoto “nuovo”)
4. un ORM con `dropSchema`/`synchronize` distruttivo (meno comune ma possibile)

### 12.1 Verifica volumi/mount MySQL
```bash
docker inspect resolvo-mysql --format '{{range .Mounts}}{{println .Type " " .Name " " .Source " -> " .Destination}}{{end}}'
docker logs --tail=120 resolvo-mysql
```

---

## 13) Avvio automatico container dopo reboot server

### 13.1 Metodo consigliato: restart policy in compose
Nel `docker-compose.yml` aggiungi a ogni servizio:
```yaml
restart: unless-stopped
```

E applica:
```bash
cd ~/app/Resolvo
docker compose up -d
sudo systemctl enable --now docker
```

### 13.2 Metodo extra-robusto: systemd unit per compose
Crea:
```bash
sudo nano /etc/systemd/system/resolvo.service
```

Contenuto:
```ini
[Unit]
Description=Resolvo Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
WorkingDirectory=/home/ubuntu/app/Resolvo
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
RemainAfterExit=yes
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Attiva:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now resolvo.service
sudo systemctl status resolvo.service --no-pager
```

---

## 14) Checklist rapida “tutto ok?”

### 14.1 Stato container
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### 14.2 Backend env DB (deve puntare a mysql:3306)
```bash
docker exec -it resolvo-backend sh -lc 'env | egrep -i "DB_|HOST|PORT|DATABASE"'
```

### 14.3 MySQL: tabelle presenti
```bash
docker exec -i resolvo-mysql mysql -u rc_user -prc_pass -D recupero_crediti -e "SHOW TABLES;"
```

---

## 15) Suggerimento utile: cartella backup + rotazione base

Crea cartella:
```bash
mkdir -p ~/app/Resolvo/backups
```

Backup `users` in `backups/`:
```bash
cd ~/app/Resolvo
docker exec resolvo-mysql sh -lc \
'mysqldump --no-tablespaces -u rc_user -prc_pass recupero_crediti users' \
> backups/users_$(date +%F_%H%M).sql
```

Elimina backup più vecchi di 14 giorni:
```bash
find ~/app/Resolvo/backups -type f -name "users_*.sql" -mtime +14 -delete
```

---

## 16) Note importanti (da ricordare)

- `docker compose up` senza `-d` resta attaccato ai log: non è “bloccato”, è normale.
- `version:` nel compose è “obsolete”: warning ignorabile.
- Usare `root` per import/restore è spesso più semplice; usare utente applicativo va bene ma può mancare di privilegi.
- Prima di “ripartire da zero”, fai **sempre** un dump dei DB/volumi.

---

Fine.
