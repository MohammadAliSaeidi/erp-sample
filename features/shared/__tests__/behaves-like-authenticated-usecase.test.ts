import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { runUsecase } from "../application/run-use-case";
import { UseCaseForbiddenError } from "../../../application/errors/use-case-errors";

export function behavesLikeAuthenticatedUsecase(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildUsecase: () => any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validInput: any,
  validAuth: AuthContext,
) {
  describe("shared authenticated behavior", () => {
    it("fails without auth", async () => {
      const usecase = buildUsecase();

      await expect(
        runUsecase({
          useCase: usecase,
          input: validInput,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          authContext: undefined as any,
        }),
      ).rejects.toBeDefined();
    });

    it("fails without permission", async () => {
      const usecase = buildUsecase();

      await expect(
        runUsecase({
          useCase: usecase,
          input: validInput,
          authContext: {
            ...validAuth,
            grantsAll: false,
            permissions: [],
          },
        }),
      ).rejects.toBeInstanceOf(UseCaseForbiddenError);
    });
  });
}
