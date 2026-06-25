import { z } from "zod";

export const releaseLockInputSchema = z.object({
  entityId: z.string().min(1),
  lockToken: z.string().min(1),
});

export type ReleaseLockInput = z.output<typeof releaseLockInputSchema>;
