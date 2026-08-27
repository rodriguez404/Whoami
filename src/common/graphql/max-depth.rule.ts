import { GraphQLError, Kind } from 'graphql';
import type { ASTVisitor, SelectionSetNode, ValidationContext } from 'graphql';

/**
 * Ограничение глубины запроса. GraphQL позволяет клиенту закрутить сколь угодно
 * вложенный запрос по циклам в графе (навык -> проекты -> навыки -> ...),
 * что превращается в отказ в обслуживании.
 */
export function maxDepthRule(maxDepth: number) {
  return (context: ValidationContext): ASTVisitor => ({
    OperationDefinition(node) {
      const depth = depthOf(node.selectionSet, context, new Set());
      if (depth > maxDepth) {
        context.reportError(
          new GraphQLError(
            `Запрос отклонён: глубина вложенности ${depth} превышает допустимые ${maxDepth}`,
            { nodes: [node], extensions: { depth, maxDepth } },
          ),
        );
      }
    },
  });
}

function depthOf(
  selectionSet: SelectionSetNode,
  context: ValidationContext,
  visitedFragments: Set<string>,
): number {
  let deepest = 0;

  for (const selection of selectionSet.selections) {
    if (selection.kind === Kind.FIELD) {
      // Служебные поля интроспекции не считаем: запрос схемы сам по себе
      // глубокий, и без этого песочница перестала бы открываться.
      if (selection.name.value.startsWith('__')) {
        continue;
      }
      const nested = selection.selectionSet
        ? depthOf(selection.selectionSet, context, visitedFragments)
        : 0;
      deepest = Math.max(deepest, nested + 1);
      continue;
    }

    if (selection.kind === Kind.INLINE_FRAGMENT) {
      deepest = Math.max(deepest, depthOf(selection.selectionSet, context, visitedFragments));
      continue;
    }

    // Фрагменты разворачиваем: иначе глубину можно спрятать за их именами.
    // Set защищает от зацикленных фрагментов.
    const name = selection.name.value;
    if (visitedFragments.has(name)) {
      continue;
    }
    const fragment = context.getFragment(name);
    if (fragment) {
      visitedFragments.add(name);
      deepest = Math.max(deepest, depthOf(fragment.selectionSet, context, visitedFragments));
      visitedFragments.delete(name);
    }
  }

  return deepest;
}
