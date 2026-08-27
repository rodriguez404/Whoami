import { z } from 'zod';

/**
 * Схема переменных окружения. Приложение падает на старте, если что-то не так,
 * а не на первом запросе к базе: сломанный конфиг должен быть виден сразу.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  APP_PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  POSTGRES_DSN: z.url({
    protocol: /^postgres(ql)?$/,
    error: 'POSTGRES_DSN должен быть postgres:// или postgresql:// URL',
  }),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Валидатор для ConfigModule. Возвращает разобранный конфиг (с применёнными
 * значениями по умолчанию) — именно он потом отдаётся из ConfigService.
 */
export function validateEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  ${issue.path.join('.') || '<root>'}: ${issue.message}`)
      .join('\n');

    throw new Error(`Некорректные переменные окружения:\n${details}`);
  }

  return result.data;
}
