# build stage
FROM node:24-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json nest-cli.json ./
COPY src ./src
RUN npm run build


# runtime stage
FROM node:24-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

# Только production-зависимости: nest CLI, typescript и прочий инструментарий
# в рантайме не нужны.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node

EXPOSE 3000

# В slim-образе нет ни curl, ни wget, зато в Node 24 есть
# глобальный fetch. Даёт docker health-статус, по которому compose ждёт готовности.
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.APP_PORT || 3000) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

# Exec-форма без sh -c: иначе PID 1 займёт шелл, SIGTERM не дойдёт до node
# и graceful shutdown не сработает — контейнер убьют по таймауту.
# --enable-source-maps: без флага Node игнорирует .js.map, и стек-трейсы
# указывают на скомпилированный JS вместо исходных .ts.
CMD ["node", "--enable-source-maps", "dist/main.js"]
