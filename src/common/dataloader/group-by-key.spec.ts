import { groupByKey } from './group-by-key';

describe('groupByKey', () => {
  const rows = [
    { parentId: 2, value: 'b1' },
    { parentId: 1, value: 'a1' },
    { parentId: 2, value: 'b2' },
  ];
  const keyOf = (row: (typeof rows)[number]) => row.parentId;
  const map = (row: (typeof rows)[number]) => row.value;

  it('раскладывает строки в порядке ключей, а не в порядке выборки', () => {
    expect(groupByKey([1, 2], rows, keyOf, map)).toEqual([['a1'], ['b1', 'b2']]);
  });

  // DataLoader падает, если длина ответа не совпала с числом ключей
  it('отдаёт пустой массив для ключа без строк', () => {
    expect(groupByKey([1, 3, 2], rows, keyOf, map)).toEqual([['a1'], [], ['b1', 'b2']]);
  });

  it('игнорирует строки, чей ключ не запрашивали', () => {
    expect(groupByKey([1], rows, keyOf, map)).toEqual([['a1']]);
  });
});
