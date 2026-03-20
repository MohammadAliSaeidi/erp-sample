export const CATEGORY_QUERY_KEYS = {
	all: ["admin", "inventory", "categories"] as const,
	list: () => [...CATEGORY_QUERY_KEYS.all, "list"] as const,
	details: () => [...CATEGORY_QUERY_KEYS.all, "detail"] as const,
	detail: (id: string) => [...CATEGORY_QUERY_KEYS.details(), id] as const,
} as const;
