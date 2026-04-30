import z from "zod";

export const StoreUserId = z.uuidv7().brand("StoreUserId");
export const RoleId = z.uuidv7().brand("RoleId");
export const AddressId = z.uuidv7().brand("AddressId");
export const StoreId = z.uuidv7().brand("StoreId");
export const CategoryId = z.uuidv7().brand("CategoryId");
export type CategoryId = z.infer<typeof CategoryId>;
export const ItemId = z.uuidv7().brand("ItemId");
export const SpecificationId = z.uuidv7().brand("SpecificationId");
export const SpecificationValueId = z.uuidv7().brand("SpecificationValueId");
