import z, { ZodString } from "zod";

export const storeSlugSchema: ZodString = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9_-]+$/);
