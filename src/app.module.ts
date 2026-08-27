import { Module } from '@nestjs/common';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { buildGraphqlOptions } from './common/graphql/graphql.options';
import { SandboxRedirectController } from './common/graphql/sandbox-redirect.controller';
import { type Env, validateEnv } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // Раскрывает ${...} внутри .env: POSTGRES_DSN собирается из POSTGRES_*,
      // чтобы креденшелы были записаны ровно в одном месте.
      expandVariables: true,
      validate: validateEnv,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) =>
        buildGraphqlOptions(config.get('NODE_ENV', { infer: true }) === 'production'),
    }),
    ProfileModule,
    HealthModule,
  ],
  controllers: [SandboxRedirectController],
})
export class AppModule {}
