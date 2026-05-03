// lib/brand.ts

/**
 * Brand type utility - create nominal types
 */
export type Brand<T, TBrand extends string> = T & {
  readonly __brand: TBrand;
};

/**
 * helper function to brand a value. no validation; only type casting
 */
export function brand<T, TBrand extends string>(value: T): Brand<T, TBrand> {
  return value as Brand<T, TBrand>;
}

/**
 * helper function to unbrand
 */
export function unbrand<T, TBrand extends string>(value: Brand<T, TBrand>): T {
  return value as T;
}

/**
 * Type guard for checking brand
 */
export type IsBranded<T, TBrand extends string> =
  T extends Brand<unknown, TBrand> ? true : false;
