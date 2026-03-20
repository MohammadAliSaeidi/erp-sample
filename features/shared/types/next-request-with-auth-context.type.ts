import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { NextRequest } from "next/server";

export type WithAuthContext<TBase extends NextRequest = NextRequest> = TBase & {
  authContext: AuthContext;
};
