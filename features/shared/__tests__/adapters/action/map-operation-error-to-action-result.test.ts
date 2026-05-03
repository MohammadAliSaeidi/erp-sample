import {
	UseCaseForbiddenError,
	UseCaseValidationError,
} from "@/application/errors/use-case-errors";
import { mapUsecaseErrorToActionResult } from "@/features/shared/adapters/action/map-usecase-error-to-action-result";
import z from "zod";

describe("mapOperationErrorToActionResult", () => {
	it("maps validation errors into a validation action failure", () => {
		const parseResult = z.object({ name: z.string().min(1) }).safeParse({
			name: "",
		});

		if (parseResult.success) {
			throw new Error("Expected parse to fail for validation test");
		}

		const result = mapUsecaseErrorToActionResult(
			new UseCaseValidationError(parseResult.error),
		);

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.code).toBe("validation");
			expect(result.error.fields).toBeDefined();
		}
	});

	it("maps forbidden errors into forbidden action failures", () => {
		const result = mapUsecaseErrorToActionResult(
			new UseCaseForbiddenError("forbidden"),
		);

		expect(result).toMatchObject({
			ok: false,
			error: {
				code: "forbidden",
				message: "forbidden",
			},
		});
	});
});
