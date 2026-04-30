import z from "zod";
import { SpecificationValueType } from "../../domain/specification/specification-value-type.enum";
import { categoryIdSchema, StoreId } from "@/features/shared/domain/ids";

export const createSpecificationSchema = z.object({
  name: z.string().trim().min(1, "Specification name is required"),
  categoryId: categoryIdSchema,
  storeId: StoreId,
  type: z.enum(SpecificationValueType),
  isRequired: z.boolean(),
  isPrimary: z.boolean(),
  specificationValues: z.array(
    z.object({
      value: z.union([z.string(), z.boolean(), z.number()]),
    }),
  ),
});
