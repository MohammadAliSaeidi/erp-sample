import z from "zod";
import { loginBodySchema } from "../schemas/login-body.schema";

export type LoginBody = z.infer<typeof loginBodySchema>;
