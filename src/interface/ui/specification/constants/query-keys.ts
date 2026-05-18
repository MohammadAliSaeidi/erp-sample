export const CATEGORY_SPECIFICATIONS_QUERY_KEYS = {
  all: ["admin", "inventory", "categories", "specifications"] as const,
  list: (categoryId: string) => [...CATEGORY_SPECIFICATIONS_QUERY_KEYS.all, "list", categoryId] as const,
  details: () => [...CATEGORY_SPECIFICATIONS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) =>
    [...CATEGORY_SPECIFICATIONS_QUERY_KEYS.details(), id] as const,
} as const;
