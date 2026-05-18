import { useEffect, useRef, useState } from "react";

export function defaultItemToString<T>(item: T | null): string {
  if (item == null) return "";
  return String(item);
}

export function createDefaultFilter<T>(itemToString: (item: T | null) => string) {
  return (items: T[], query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => itemToString(item).toLowerCase().includes(q));
  };
}

export function isEqual<T>(
  a: T,
  b: T,
  opts: {
    isItemEqual?: (x: T, y: T) => boolean;
    itemToKey?: (x: T) => string | number;
  }
) {
  if (opts.isItemEqual) return opts.isItemEqual(a, b);
  if (opts.itemToKey) return opts.itemToKey(a) === opts.itemToKey(b);
  return Object.is(a, b);
}

export function useControlledState<T>(
  controlled: T | undefined,
  defaultValue: T
): [T, (v: T) => void, boolean] {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : uncontrolled;

  const setValue = (v: T) => {
    if (!isControlled) setUncontrolled(v);
  };

  return [value, setValue, isControlled];
}

export function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), Math.max(0, delayMs));
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

export function useLatest<T>(value: T) {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
