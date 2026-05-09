import { z } from "zod";

const onlyOneKey = (obj: Record<string, unknown>) =>
  Object.values(obj).filter((v) => v !== undefined).length <= 1;

export const stringFilterSchema = z
  .object({
    eq: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
  })
  .refine(onlyOneKey, "Only one string operator allowed");

export const numberFilterSchema = z
  .object({
    eq: z.coerce.number().optional(),
    gt: z.coerce.number().optional(),
    gte: z.coerce.number().optional(),
    lt: z.coerce.number().optional(),
    lte: z.coerce.number().optional(),
    between: z
      .object({
        from: z.coerce.number(),
        to: z.coerce.number(),
      })
      .optional(),
  })
  .refine(onlyOneKey, "Only one number operator allowed");

export const dateFilterSchema = z
  .object({
    eq: z.coerce.date().optional(),
    before: z.coerce.date().optional(),
    after: z.coerce.date().optional(),
    between: z
      .object({
        from: z.coerce.date(),
        to: z.coerce.date(),
      })
      .optional(),
  })
  .refine(onlyOneKey, "Only one date operator allowed");

export const booleanFilterSchema = z
  .object({
    eq: z.coerce.boolean().optional(),
  })
  .refine(onlyOneKey, "Only one boolean operator allowed");
