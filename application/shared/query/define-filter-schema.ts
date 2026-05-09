import z from "zod";

export type ZodShape = z.ZodRawShape;

export function defineFilterSchema<TDTO extends object>() {
  return <TShape extends Partial<Record<keyof TDTO, z.ZodTypeAny>>>(
    shape: TShape
  ) => z.object(shape);
}
