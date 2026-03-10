export const URLS = {
	STORE: {
		LOGIN: (storeSlug: string) => `/store/${storeSlug}/login`,
		DASHBOARD: (storeSlug: string) => `/store/${storeSlug}/dashboard`,
		INVENTORY: {
			INDEX: (storeSlug: string) => `/store/${storeSlug}/inventory`,
			ITEMS: {
				LIST: (storeSlug: string) =>
					`/store/${storeSlug}/inventory/items`,
				CREATE: (storeSlug: string) =>
					`/store/${storeSlug}/inventory/items/form`,
				EDIT: (storeSlug: string, itemId: string) =>
					`/store/${storeSlug}/inventory/items/form/${itemId}`,
				DETAILS: (storeSlug: string, itemId: string) =>
					`/store/${storeSlug}/inventory/items/${itemId}`,
			},
			CATEGORIES: {
				LIST: (storeSlug: string) =>
					`/store/${storeSlug}/inventory/categories`,
				CREATE: (storeSlug: string) =>
					`/store/${storeSlug}/inventory/categories/form`,
				EDIT: (storeSlug: string, itemId: string) =>
					`/store/${storeSlug}/inventory/categories/form/${itemId}`,
				DETAILS: (storeSlug: string, itemId: string) =>
					`/store/${storeSlug}/inventory/categories/${itemId}`,
			},
		},
	},
} as const;
