import z from "zod";
import { loginInputSchema } from "../schemas/login-body.schema";

export type LoginInput = z.infer<typeof loginInputSchema>;
