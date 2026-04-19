export const URLS = {
  STORE: {
    ADMIN: {
      LOGIN: (storeSlug: string) => `/store/${storeSlug}/admin/login`,
      DASHBOARD: (storeSlug: string) => `/store/${storeSlug}/admin/dashboard`,
      INVENTORY: {
        INDEX: (storeSlug: string) => `/store/${storeSlug}/admin/inventory`,
        ITEMS: {
          LIST: (storeSlug: string) =>
            `/store/${storeSlug}/admin/inventory/items`,
          CREATE: (storeSlug: string) =>
            `/store/${storeSlug}/admin/inventory/items/form`,
          EDIT: (storeSlug: string, itemId: string) =>
            `/store/${storeSlug}/admin/inventory/items/form/${itemId}`,
          DETAILS: (storeSlug: string, itemId: string) =>
            `/store/${storeSlug}/admin/inventory/items/${itemId}`,
        },
        CATEGORIES: {
          LIST: (storeSlug: string) =>
            `/store/${storeSlug}/admin/inventory/categories`,
          CREATE: (storeSlug: string) =>
            `/store/${storeSlug}/admin/inventory/categories/create`,
          EDIT: (storeSlug: string, itemId: string) =>
            `/store/${storeSlug}/admin/inventory/categories/form/${itemId}`,
          DETAILS: (storeSlug: string, itemId: string) =>
            `/store/${storeSlug}/admin/inventory/categories/${itemId}`,
        },
      },
    },
  },
} as const;
