import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import type { Env } from './config/env.validation';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const config = app.get(ConfigService<Env, true>);
  const port = config.get('APP_PORT', { infer: true });

  // 0.0.0.0 явно: внутри контейнера привязка к localhost сделала бы порт недоступным снаружи
  await app.listen(port, '0.0.0.0');

  Logger.log(`Приложение слушает порт ${port}`, 'Bootstrap');
}

void bootstrap();
