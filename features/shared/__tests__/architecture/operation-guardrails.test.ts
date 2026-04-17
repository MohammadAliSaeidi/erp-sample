import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());

const transportFiles = [
	"app/api/v1/inventory/category/route.ts",
	"app/api/v1/inventory/category/[categoryId]/route.ts",
	"app/api/v1/auth/login/route.ts",
	"features/categories/actions/create-category.action.ts",
	"features/categories/actions/update-category.action.ts",
	"features/auth/actions/login.action.ts",
];

describe("operation architecture guardrails", () => {
	it("keeps permissions declared in operations, not transports", () => {
		for (const relativePath of transportFiles) {
			const absolutePath = path.join(ROOT, relativePath);
			const fileContent = fs.readFileSync(absolutePath, "utf8");

			expect(fileContent).not.toMatch(/PERMISSIONS\./);
			expect(fileContent).not.toMatch(/withAuthorization\(/);
		}
	});
});
