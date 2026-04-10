import z from "zod";
import { authContextSchema } from "../schemas/auth-context.schema";
// import { Permission } from "./permission.type";

// Permissions are already resolved — handlers never need to look them up.
export type AuthContext = z.infer<typeof authContextSchema>;

// {
//   adminId: string;
//   storeId: string;
//   storeSlug: string;
//   username: string;
//   roleId: string;
//   permissions?: Permission[];
// };
