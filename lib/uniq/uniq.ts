/**
 * A key that can be used to identify unique items.
 *
 * `Set` can safely store all JavaScript property-key types:
 * strings, numbers, and symbols.
 */
export type UniqueKey = string | number | symbol;

/**
 * Returns a new array containing only the first item for each unique key.
 *
 * The function preserves the original order of the input array and keeps the
 * first occurrence when multiple items produce the same key.
 *
 * This function does not mutate the input array.
 *
 * @template T
 *
 * @param items - The source items to remove duplicates from.
 * @param getKey - Function used to derive a uniqueness key from each item.
 *
 * @returns A new array with duplicate-key items removed.
 *
 * @example
 *
 * ```ts
 * const users = [
 *   { id: '1', name: 'Alice' },
 *   { id: '2', name: 'Bob' },
 *   { id: '1', name: 'Alice Updated' },
 * ];
 *
 * const uniqueUsers = uniq(users, user => user.id);
 *
 * // [
 * //   { id: '1', name: 'Alice' },
 * //   { id: '2', name: 'Bob' }
 * // ]
 *
 */
export function uniq<T>(
  items: readonly T[],
  getKey: (item: T) => UniqueKey
): T[] {
  const seenKeys = new Set<UniqueKey>();

  const uniqueItems: T[] = [];

  for (const item of items) {
    const key = getKey(item);

    if (seenKeys.has(key)) {
      continue;
    }

    seenKeys.add(key);
    uniqueItems.push(item);
  }

  return uniqueItems;
}
