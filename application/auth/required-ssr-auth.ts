import { ResolveAuthContext, AuthContextSource } from "./resolve-auth-context";
import { UseCaseUnauthorizedError } from "@/application/errors/use-case-errors";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";

export type RequireSsrAuth = (
  source?: Pick<AuthContextSource, "storeSlug">,
) => Promise<AuthContext>;

export const buildRequireSsrAuth =
  (resolveAuthContext: ResolveAuthContext): RequireSsrAuth =>
  async (source) => {
    const authContext = await resolveAuthContext(source);
    if (!authContext) {
      throw new UseCaseUnauthorizedError("Authentication required");
    }
    return authContext;
  };
