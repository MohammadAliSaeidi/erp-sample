import z from "zod";
import { categoryIdSchema, storeIdSchema } from "@/features/shared/domain/ids";
import { SpecificationValueType } from "@/domain/specification/specification-value-type.enum";

export const createSpecificationSchema = z.object({
  name: z.string().trim().min(1, "Specification name is required"),
  categoryId: categoryIdSchema,
  storeId: storeIdSchema,
  type: z.enum(SpecificationValueType),
  isRequired: z.boolean(),
  isPrimary: z.boolean(),
  specificationValues: z.array(
    z.object({
      value: z.union([z.string(), z.boolean(), z.number()]),
    }),
  ),
});
