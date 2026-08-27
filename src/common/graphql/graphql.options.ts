import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';

import { formatGraphqlError } from '../errors/format-graphql-error';
import { maxDepthRule } from './max-depth.rule';

// Запрос из текста тестового задания: песочница открывается с ним уже вписанным.
const SANDBOX_DOCUMENT = `query {
  profile {
    name
    description
    skills {
      name
    }
    experience {
      company
      position
    }
    projects {
      name
    }
  }
}`;

// Глубина, после которой запрос считается злонамеренным. Самый глубокий
// осмысленный путь — profile → experience → skills → projects → поле.
const MAX_QUERY_DEPTH = 10;

export function buildGraphqlOptions(isProduction: boolean): Omit<ApolloDriverConfig, 'driver'> {
  return {
    // В контейнере каталог принадлежит root, а процесс идёт под node: писать
    // файл схемы некуда, поэтому в проде она собирается в памяти.
    autoSchemaFile: isProduction ? true : join(process.cwd(), 'schema.gql'),
    sortSchema: true,

    // Apollo Server отключает интроспекцию при NODE_ENV=production — без этого
    // задеплоенная песочница не увидит схему.
    introspection: true,

    // Nest по умолчанию подключает собственную страницу-лендинг, а Apollo
    // разрешает только один такой плагин — иначе падение на старте.
    playground: false,

    // Правило валидации, а не плагин: запрос отбраковывается до выполнения,
    // и типы не зависят от мажорной версии Apollo Server.
    validationRules: [maxDepthRule(MAX_QUERY_DEPTH)],

    formatError: formatGraphqlError,

    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true, document: SANDBOX_DOCUMENT }),
    ],
  };
}
