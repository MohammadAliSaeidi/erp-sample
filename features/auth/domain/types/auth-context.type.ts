import z from "zod";
import { adminAuthContextSchema } from "../schemas/auth-context.schema";

export type AuthContext = z.infer<typeof adminAuthContextSchema>;