# Guida rapida al deployment

## 1. Prerequisiti

- Node.js ≥ 20 (frontend e backend condividono stack).
- MySQL compatibile e accesso al database `recupero_crediti`.
- File `.env` con variabili principali (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `JWT_SECRET`, `FRONTEND_URL`, `PORT`).
- `npm install` sia nella root `apps/backend` che `apps/frontend`.

## 2. Backend

1. Genera eventuali entità e migrazioni (ad oggi si usano migrazioni manuali SQL presenti in `create-database-schema.sql`). Esegui le query direttamente sul database prima dell’avvio.
2. Imposta il `.env` (es.):
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=rc_user
   DB_PASSWORD=rc_pass
   DB_DATABASE=recupero_crediti
   JWT_SECRET=<segretissima>
   NODE_ENV=production
   ```
3. Avvia con `npm run start:prod` (dopo `npm run build`) oppure `npm run start:dev` per ambiente di sviluppo.
4. La documentazione Swagger rimane disponibile su `/api-docs`.

## 3. Frontend

1. Configura `apps/frontend/.env` (o `import.meta.env`): definisci `VITE_API_BASE_URL` (es. `https://api.resolvo.com`).
2. Esegui `npm run build` per produrre il bundle ottimizzato.
3. Servi i file generati da `dist` con un server statico (Nginx, Vercel, ecc.).
4. Se usi `Docker`, costruisci un’immagine con `docker build -t resolvo-frontend .` puntando il `Dockerfile` (da creare se serve).

## 4. Considerazioni di sicurezza

- Usa HTTPS e abilita HSTS; i token JWT vengono emessi con `AuthService.issueTokens`.
- Il rate limiting globale impedisce bruteforce sugli endpoint critici (vedi `RateLimitGuard`).
- Assicurati di ruotare regolarmente `JWT_SECRET` e il refresh token di ogni utente con `logoutAll`.

## 5. Operazioni post-deployment

- Monitora i log su `console` e controlla `/api-docs` per confermare che Swagger sia attivo.
- Altera `FRONTEND_URL` nelle variabili d’ambiente per restringere i CORS.
