export const createStoreSchema = z.object({
  id: storeIdSchema,
  name: z.string(),
  address: addressIdSchema,
  users: z.array(StoreUser),
  slug: storeSlugSchema,
});