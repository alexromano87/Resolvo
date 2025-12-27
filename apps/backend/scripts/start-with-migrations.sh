#!/usr/bin/env sh
set -e

echo "[startup] Running pending migrations..."
npm run migration:run
echo "[startup] Starting NestJS app"

exec npm run start:prod
