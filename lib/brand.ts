import { z } from "zod";

export type Brand<A, B extends string> = A & z.BRAND<B>;
export const Brand = <T extends z.ZodTypeAny, T2 extends string>(
  schema: T,
  brand: T2,
) => schema.brand(brand);

export const brand = <T, B extends string>(value: T): Brand<T, B> =>
  value as Brand<T, B>;
