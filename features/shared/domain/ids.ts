import z from "zod";

export const StoreUserId = z.uuidv7().brand("StoreUserId");
export const RoleId = z.uuidv7().brand("RoleId");
export const AddressId = z.uuidv7().brand("AddressId");
export const StoreId = z.uuidv7().brand("StoreId");
export const CategoryId = z.uuidv7().brand("CategoryId");
export const ItemId = z.uuidv7().brand("ItemId");
