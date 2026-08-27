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

// Самый глубокий осмысленный путь: profile -> experience -> skills -> projects -> поле
const MAX_QUERY_DEPTH = 10;

export function buildGraphqlOptions(isDevelopment: boolean): Omit<ApolloDriverConfig, 'driver'> {
  return {
    autoSchemaFile: isDevelopment ? join(process.cwd(), 'schema.gql') : true,
    sortSchema: true,

    introspection: true,
    playground: false,

    validationRules: [maxDepthRule(MAX_QUERY_DEPTH)],

    formatError: formatGraphqlError,

    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true, document: SANDBOX_DOCUMENT }),
    ],
  };
}
