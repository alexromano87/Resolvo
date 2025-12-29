FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY ./src ./src
COPY ./data-source.ts ./data-source.ts
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY scripts ./scripts
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app

COPY package*.json ./
# Usa i node_modules già installati (dev + prod) dal builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/data-source.ts ./data-source.ts
COPY --from=builder /usr/src/app/tsconfig*.json ./
COPY --from=builder /usr/src/app/nest-cli.json ./
COPY --from=builder /usr/src/app/scripts/start-with-migrations.sh ./start-with-migrations.sh

RUN chmod +x ./start-with-migrations.sh

EXPOSE 3000
CMD ["./start-with-migrations.sh"]
