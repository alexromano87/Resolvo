# Guida rapida al deployment

## 1. Prerequisiti

- Node.js ≥ 20 (frontend e backend condividono stack).
- MySQL compatibile e accesso al database `recupero_crediti`.
- File `.env` con variabili principali (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `JWT_SECRET`, `FRONTEND_URL`, `PORT`).
- Variabile facoltativa `UPLOAD_DOCUMENT_MAX_MB` (default 50) per limitare dimensione upload documenti.
- `npm install` sia nella root `apps/backend` che `apps/frontend`.

## 2. Backend

1. Genera eventualmente nuove entità e migrazioni tramite TypeORM CLI: `cd apps/backend && npm run migration:generate -- -n NomeMigrazione`. Il file `data-source.ts` punta allo stesso database dell’app.
2. Lo script `scripts/start-with-migrations.sh` (usato dal container di deployment) esegue `npm run migration:run` automaticamente prima di avviare `npm run start:prod`, quindi non è necessario lanciare manualmente le migrazioni in produzione; puoi comunque utilizzare `npm run migration:run` in fase di sviluppo/test.
3. (esistente) ...
4. Imposta il `.env` (es.):
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=rc_user
   DB_PASSWORD=rc_pass
   DB_DATABASE=recupero_crediti
   JWT_SECRET=<segretissima>
   NODE_ENV=production
   ```
4. Avvia con `npm run build` e poi `npm run start:prod`, oppure `npm run start:dev` per sviluppo rapido.
4. La documentazione Swagger rimane disponibile su `/api-docs`.

## 3. Frontend

1. Configura `apps/frontend/.env` (o `import.meta.env`): definisci `VITE_API_BASE_URL` (es. `https://api.resolvo.com`).
5. Esegui `npm run build` per produrre il bundle ottimizzato.
3. Servi i file generati da `dist` con un server statico (Nginx, Vercel, ecc.).
4. Usa `docker build -t resolvo/frontend:latest apps/frontend` e esponi il contenuto di `/usr/share/nginx/html`. Il `Dockerfile` è già incluso in `apps/frontend/Dockerfile`.

## 4. Considerazioni di sicurezza

- Usa HTTPS e abilita HSTS; i token JWT vengono emessi con `AuthService.issueTokens`.
- Il rate limiting globale impedisce bruteforce sugli endpoint critici (vedi `RateLimitGuard`).
- Assicurati di ruotare regolarmente `JWT_SECRET` e il refresh token di ogni utente con `logoutAll`.

## 5. Operazioni post-deployment

- Monitora i log su `console` e controlla `/api-docs` per confermare che Swagger sia attivo.
- Altera `FRONTEND_URL` nelle variabili d’ambiente per restringere i CORS.

## 6. Docker e CI/CD

- Il `Dockerfile` per backend e frontend si trovano rispettivamente in `apps/backend/Dockerfile` e `apps/frontend/Dockerfile`; usa `docker build -t resolvo/backend:latest apps/backend` per creare l’immagine e poi `docker run -p 3000:3000 resolvo/backend:latest`.
- Il `docker-compose.yml` (nella root) orchestri `database`, `backend` e `frontend`, e ogni backend container usa `scripts/start-with-migrations.sh` per applicare le migrazioni prima dell'avvio. Usa `docker compose up --build` per avviare l’intero stack in locale o in staging.
- La pipeline GitHub Actions (`.github/workflows/ci.yml`) installa dipendenze, esegue tutti i test e costruisce le immagini Docker (`resolvo/backend:latest` + `resolvo/frontend:latest`). Per pubblicare su un registry esterno basta impostare i segreti `REGISTRY_URL`, `REGISTRY_USER`, `REGISTRY_TOKEN` e abilitare `push: true` nei passaggi `docker/build-push-action`.
