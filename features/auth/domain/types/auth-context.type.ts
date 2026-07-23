import z from "zod";
import { adminAuthContextSchema } from "../schemas/auth-context.schema";
import { Prettify } from "@/features/shared/types/prettify.type";

export type AuthContext = Prettify<z.infer<typeof adminAuthContextSchema>>;
