export const ITEM_QUERY_KEYS = {
  all: ["admin", "inventory", "item"] as const,
  list: () => [...ITEM_QUERY_KEYS.all, "list"] as const,
  details: () => [...ITEM_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ITEM_QUERY_KEYS.details(), id] as const,
} as const;
