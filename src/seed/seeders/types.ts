import type { Prisma } from '../../generated/prisma/client';

// Сидеры работают внутри транзакции, поэтому принимают TransactionClient,
// а не полный PrismaClient: $connect и подобное внутри транзакции недоступны.
export type SeedDb = Prisma.TransactionClient;

export type SkillIds = ReadonlyMap<string, number>;
