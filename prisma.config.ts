import { config as readEnvFile } from 'dotenv';
import { expand } from 'dotenv-expand';
import { defineConfig } from 'prisma/config';

// Prisma 7 не читает .env сама, а POSTGRES_DSN в нём собран из ${POSTGRES_*} —
// нужен и разбор файла, и раскрытие подстановок. В контейнере файла нет,
// переменные приходят из окружения, и оба вызова просто ничего не делают.
expand(readEnvFile({ quiet: true }));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Не env() из prisma/config: тот падает на отсутствующей переменной уже при
  // загрузке конфига, а prisma generate работает без базы и не должен её требовать.
  datasource: { url: process.env.POSTGRES_DSN },
  migrations: { seed: 'node dist/seed/seed.js' },
});
