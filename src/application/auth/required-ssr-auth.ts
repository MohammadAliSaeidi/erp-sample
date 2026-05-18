// import { ResolveAuthContext } from "./resolve-auth-context";
// import { UseCaseUnauthorizedError } from "@/src/application/shared/errors/use-case-errors";
// import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
//
// export type RequireSsrAuth = () => Promise<AuthContext>;
//
// export const buildRequireSsrAuth = (
//   resolveAuthContext: ResolveAuthContext,
//   getToken: () => Promise<string | null>,
// ): RequireSsrAuth => {
//   return async () => {
//     const authContext = await resolveAuthContext(await getToken());
//     if (!authContext) {
//       throw new UseCaseUnauthorizedError("Authentication required");
//     }
//     return authContext;
//   };
// };
