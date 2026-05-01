import z from "zod";

export type Brand<T, TBrand extends string | symbol> = T & {
  readonly __brand: TBrand;
};

export const storeUserIdSchema = z.uuidv7().brand("StoreUserId");
export const roleIdSchema = z.uuidv7().brand("RoleId");
export const addressIdSchema = z.uuidv7().brand("AddressId");
export const itemIdSchema = z.uuidv7().brand("ItemId");
export const specificationIdSchema = z.uuidv7().brand("SpecificationId");
export const specificationValueIdSchema = z
  .uuidv7()
  .brand("SpecificationValueId");
export const categoryIdSchema = z.uuidv7().brand("CategoryId");
export const storeIdSchema = z.uuidv7().brand("StoreId");

export type StoreUserId = z.infer<typeof storeUserIdSchema>;
export type RoleId = z.infer<typeof roleIdSchema>;
export type AddressId = z.infer<typeof addressIdSchema>;
export type ItemId = z.infer<typeof itemIdSchema>;
export type SpecificationId = z.infer<typeof specificationIdSchema>;
export type SpecificationValueId = z.infer<typeof specificationValueIdSchema>;
export type CategoryId = z.infer<typeof categoryIdSchema>;
export type StoreId = z.infer<typeof storeIdSchema>;
