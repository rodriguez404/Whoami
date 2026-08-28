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
# --chmod: git под Windows не хранит бит исполнения
COPY --chmod=0755 docker-entrypoint.sh /usr/local/bin/

USER node

EXPOSE 3000

# В slim-образе нет ни curl, ни wget, зато в Node 24 есть глобальный fetch.
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
    CMD ["node", "-e", "const u = 'http://127.0.0.1:' + (process.env.APP_PORT || 3000) + '/health'; fetch(u).then(async (r) => { if (!r.ok) { console.log('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200)); process.exit(1); } console.log('ok'); }).catch((e) => { console.log(u + ' -> ' + e.message + (e.cause ? ' / ' + e.cause.message : '')); process.exit(1); })"]

ENTRYPOINT ["docker-entrypoint.sh"]

# --enable-source-maps: без флага Node игнорирует .js.map и трейсы указывают на скомпилированный JS.
CMD ["node", "--enable-source-maps", "dist/main.js"]
