export type Brand<T, TBrand extends string | symbol> = T & {
  readonly __brand: TBrand;
};

export type StoreUserId = Brand<string, "StoreUserId">;
export type RoleId = Brand<string, "RoleId">;
export type AddressId = Brand<string, "AddressId">;
export type ItemId = Brand<string, "ItemId">;
export type SpecificationId = Brand<string, "SpecificationId">;
export type SpecificationValueId = Brand<string, "SpecificationValueId">;
export type CategoryId = Brand<string, "CategoryId">;
export type StoreId = Brand<string, "StoreId">;
