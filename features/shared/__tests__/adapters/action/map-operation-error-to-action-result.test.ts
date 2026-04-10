import {
	OperationForbiddenError,
	OperationValidationError,
} from "@/features/shared/application/errors/operation-errors";
import { mapOperationErrorToActionResult } from "@/features/shared/adapters/action/map-operation-error-to-action-result";
import z from "zod";

describe("mapOperationErrorToActionResult", () => {
	it("maps validation errors into a validation action failure", () => {
		const parseResult = z.object({ name: z.string().min(1) }).safeParse({
			name: "",
		});

		if (parseResult.success) {
			throw new Error("Expected parse to fail for validation test");
		}

		const result = mapOperationErrorToActionResult(
			new OperationValidationError(parseResult.error),
		);

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.code).toBe("validation");
			expect(result.error.fields).toBeDefined();
		}
	});

	it("maps forbidden errors into forbidden action failures", () => {
		const result = mapOperationErrorToActionResult(
			new OperationForbiddenError("forbidden"),
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
