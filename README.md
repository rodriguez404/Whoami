# whoami

Цифровая визитка: GraphQL API, отдающее профиль специалиста, навыки, опыт работы
и проекты. Интерфейс — Apollo Sandbox.

**Стек:** TypeScript, Node.js 24, NestJS 11, Prisma 7, PostgreSQL 18, GraphQL
(Apollo Server 5), Docker.

## Запуск

```bash
docker compose up --build
```

Больше ничего делать не нужно: compose дожидается готовности базы, накатывает
миграции, наполняет её данными и поднимает приложение. Файл `.env` не обязателен —
значения по умолчанию заданы в `compose.yaml`.

Откройте <http://localhost:3000> — корень уводит в песочницу с уже вписанным
запросом.

## Пример запроса

```graphql
query {
  profile {
    name
    description
    skills { name }
    experience { company position }
    projects { name }
  }
}
```

Вложенные данные разрешаются лениво: если не запросить `experience`, в базу за
ним никто не пойдёт.

Фильтры живут на вложенных полях:

```graphql
query {
  profile {
    skills(category: INFRA) { name }
    projects(kind: GAMEDEV) { name url }
  }
}
```

Контракт API целиком — в [`schema.gql`](schema.gql).

## Документация

- [Архитектура](docs/architecture.md) — слои, модули, работа с вложенными
  данными, устройство сида, что происходит при старте.
- [Что намеренно не сделано](docs/overengineer-features.md) — чего в проекте нет
  и почему, с условиями, при которых решение изменилось бы.

## Разработка

Нужны Node 24 и запущенный PostgreSQL (проще всего `docker compose up postgres`).

```bash
cp .env.example .env
npm ci
npm run generate        # клиент Prisma, в репозиторий не коммитится
npx prisma migrate deploy
npm run start:dev
```

| Команда | Что делает |
| --- | --- |
| `npm run lint` | eslint, включая проверку форматирования |
| `npm run typecheck` | `tsc --noEmit` по всему проекту вместе с тестами |
| `npm test` | unit-тесты |
| `npm run test:e2e` | e2e-тесты, нужна поднятая база |

Личные данные (ФИО, контакты) подставляются из окружения — в репозитории лежат
заглушки, см. `.env.example`.
