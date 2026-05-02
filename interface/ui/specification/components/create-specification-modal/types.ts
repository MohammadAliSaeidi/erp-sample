import { createSpecificationSchema } from "@/interface/schema/specification/create-specification.schema";
import z from "zod";

export type CreateSpecificationFormInputValues = z.input<typeof createSpecificationSchema>;

export type CreateSpecificationFormOutputValues = z.output<typeof createSpecificationSchema>;
