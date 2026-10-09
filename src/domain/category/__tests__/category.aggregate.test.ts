import { brand } from "@/lib/brand";
import { Category } from "@/src/domain/category/aggregates/category.aggregate";
import { DomainRequiredFieldError } from "@/src/domain/core/errors/validation.error";

describe("Category aggregate", () => {
	it("creates a category with trimmed name", () => {
		const category = Category.create({
			name: "  Beverages  ",
			description: "Hot and cold drinks",
		});

		expect(category.name).toBe("Beverages");
		expect(category.description).toBe("Hot and cold drinks");
		expect(category.id).toBeDefined();
		expect(Object.isFrozen(category)).toBe(true);
	});

	it("defaults description to null", () => {
		const category = Category.create({ name: "Food" });

		expect(category.description).toBeNull();
	});

	it("rejects empty name", () => {
		expect(() => Category.create({ name: "   " })).toThrow(
			DomainRequiredFieldError,
		);
	});

	it("rehydrates from persistence with a known id", () => {
		const id = brand<string, "CategoryId">("cat-1") as Category.Id;

		const category = Category.rehydrate({
			id,
			name: "Desserts",
			description: null,
		});

		expect(category.id).toBe(id);
		expect(category.name).toBe("Desserts");
	});
});
