export const URLS = {
  STORE: {
    LOGIN: (storeSlug: string) => `/store/${storeSlug}/login`,
    DASHBOARD: (storeSlug: string) => `/store/${storeSlug}/dashboard`,
    INVENTORY: {
      INDEX: (storeSlug: string) => `/store/${storeSlug}/inventory`,
      ITEMS: {
        LIST: (storeSlug: string) => `/store/${storeSlug}/inventory/items`,
        DETAILS: (storeSlug: string, itemId: string) =>
          `/store/${storeSlug}/inventory/items/${itemId}`,
      },
    },
  },
} as const;
