import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import type { NextRequest } from "next/server";

export interface ResolveAuthContextFromRequestPort {
  (request: NextRequest): Promise<AuthContext>;
}
