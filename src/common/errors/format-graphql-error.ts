import { unwrapResolverError } from '@apollo/server/errors';
import type { GraphQLFormattedError } from 'graphql';

import { NotFoundError } from './domain.errors';

// Без этого доменные ошибки уезжают клиенту как INTERNAL_SERVER_ERROR:
// всё, что не GraphQLError, Apollo считает сбоем сервера.
export function formatGraphqlError(
  formatted: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const original = unwrapResolverError(error);

  if (original instanceof NotFoundError) {
    return {
      ...formatted,
      message: original.message,
      extensions: { ...formatted.extensions, code: 'NOT_FOUND' },
    };
  }

  return formatted;
}
