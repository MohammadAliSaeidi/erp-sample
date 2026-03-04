import z from "zod";

export const loginBodySchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
