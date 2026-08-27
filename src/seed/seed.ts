import { PrismaPg } from '@prisma/adapter-pg';
import { config as readEnvFile } from 'dotenv';
import { expand } from 'dotenv-expand';

import { PrismaClient } from '../generated/prisma/client';
import { seedExperience } from './seeders/experience';
import { seedProfile } from './seeders/profile';
import { seedProjects } from './seeders/projects';
import { seedSkills } from './seeders/skills';

expand(readEnvFile({ quiet: true }));

// Наполнение целиком в одной транзакции: упавший на середине сид не должен
// оставлять базу с половиной обновлённого контента.
const TRANSACTION_TIMEOUT_MS = 30_000;

async function main(): Promise<void> {
  const connectionString = process.env.POSTGRES_DSN;
  if (!connectionString) {
    throw new Error('POSTGRES_DSN не задан: сид не знает, к какой базе подключаться');
  }

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    await db.$transaction(
      async (tx) => {
        const skillIds = await seedSkills(tx);
        await seedProfile(tx);
        await seedExperience(tx, skillIds);
        await seedProjects(tx, skillIds);
      },
      { timeout: TRANSACTION_TIMEOUT_MS },
    );
    console.log('Сид выполнен');
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('Сид упал:', error);
  process.exitCode = 1;
});
