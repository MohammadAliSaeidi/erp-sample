import { NextRequest } from "next/server";
import { AuthContext } from "./auth-context.type";

// The signature every protected route handler must conform to.
// auth is injected by withAuthorization — no handler should fetch it itself.
export type ApiHandler<TContext = unknown> = (
	req: NextRequest,
	ctx: TContext,
	auth: AuthContext,
) => Promise<Response> | Response;
