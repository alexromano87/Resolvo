FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY ./src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY scripts ./scripts
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/scripts/start-with-migrations.sh ./start-with-migrations.sh

RUN chmod +x ./start-with-migrations.sh

EXPOSE 3000
CMD ["./start-with-migrations.sh"]
