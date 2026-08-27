#  build stage
FROM node:24-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json nest-cli.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

RUN npm run generate && npm run build

#  runtime stage
FROM node:24-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
# Схема и конфиг нужны в рантайме: миграции накатываются при старте контейнера.
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY docker-entrypoint.sh /usr/local/bin/

USER node

EXPOSE 3000

# В slim-образе нет ни curl, ни wget, зато в Node 24 есть глобальный fetch.
HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.APP_PORT || 3000) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

ENTRYPOINT ["docker-entrypoint.sh"]

# --enable-source-maps: без флага Node игнорирует .js.map и трейсы указывают на скомпилированный JS.
CMD ["node", "--enable-source-maps", "dist/main.js"]
