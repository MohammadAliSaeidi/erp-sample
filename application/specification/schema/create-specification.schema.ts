import z from "zod";
import { SpecificationValueType } from "@/domain/specification/specification-value-type.enum";

export const createSpecificationSchema = z.object({
  name: z
    .string({ error: "Specification name is required" })
    .trim()
    .min(1, "Specification name is required"),
  categoryId: z.uuidv7(),
  type: z.enum(SpecificationValueType, { error: "Type is required" }),
  isRequired: z.boolean(),
  isPrimary: z.boolean(),
  specificationValues: z
    .array(
      z.object({
        value: z.union([z.string(), z.boolean(), z.number()]),
      }),
    )
    .min(1, { message: "Specification must have at least one value" })
    .superRefine((items, ctx) => {
      const seen = new Set<string>();

      items.forEach((item, index) => {
        const key =
          typeof item.value === "string"
            ? item.value.trim().toLowerCase()
            : String(item.value);

        if (seen.has(key)) {
          ctx.addIssue({
            code: "custom",
            message: "Duplicate value",
            path: [index, "value"],
          });
        } else {
          seen.add(key);
        }
      });
    }),
});
