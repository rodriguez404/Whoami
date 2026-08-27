// DataLoader требует, чтобы результат был выровнен по входным ключам:
// i-й элемент ответа обязан относиться к i-му ключу, даже если строк нет.
export function groupByKey<Row, Out>(
  keys: readonly number[],
  rows: Row[],
  keyOf: (row: Row) => number,
  map: (row: Row) => Out,
): Out[][] {
  const grouped = new Map<number, Out[]>();
  for (const key of keys) {
    grouped.set(key, []);
  }
  for (const row of rows) {
    grouped.get(keyOf(row))?.push(map(row));
  }
  return keys.map((key) => grouped.get(key) ?? []);
}
