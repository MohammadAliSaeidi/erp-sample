import { brand } from "@/lib/brand";
import { CategoryId } from "@/src/domain/category/category-id";
import { DomainValidationError } from "@/src/domain/core/errors/validation.error";
import { Item } from "@/src/domain/item/aggregates/item.aggregate";
import { SpecificationId } from "@/src/domain/specification/specification-id";
import { SpecificationValueId } from "@/src/domain/specification/specification-value-id";
import { Category } from "../../category/aggregates/category.aggregate";

const CATEGORY_ID: CategoryId = brand("018f3c8a-0000-7000-8000-000000000003");
const SPEC_ID: SpecificationId = brand("018f3c8a-0000-7000-8000-000000000004");

const SPEC_VALUE_ID: SpecificationValueId = brand(
	"018f3c8a-0000-7000-8000-000000000005",
);

describe("Item aggregate", () => {
	let category: Category.Aggregate;

	beforeAll(() => {
		category = Category.create({
			name: "My Category",
		});
	});

	it("creates an item with normalized fields", () => {
		const item = Item.createNew({
			name: "  Latte  ",
			number: " 1001 ",
			price: 12.5,
			categoryId: category.id,
			specificationAssignments: [
				{
					specificationId: SPEC_ID,
					specificationValueId: SPEC_VALUE_ID,
				},
			],
		});

		expect(item.name).toBe("Latte");
		expect(item.number).toBe("1001");
		expect(item.price).toBe(12.5);
		expect(item.categoryId).toBe(category.id);
		expect(item.specificationAssignments).toHaveLength(1);
		expect(item.isDeleted).toBe(true);
		expect(Object.isFrozen(item)).toBe(true);
	});

	it("deduplicates specification assignments by specification id", () => {
		const item = Item.createNew({
			name: "Mocha",
			number: "1002",
			price: 15,
			categoryId: category.id,
			specificationAssignments: [
				{
					specificationId: SPEC_ID,
					specificationValueId: SPEC_VALUE_ID,
				},
				{
					specificationId: SPEC_ID,
					specificationValueId: brand(
						"018f3c8a-0000-7000-8000-000000000006",
					),
				},
			],
		});

		expect(item.specificationAssignments).toHaveLength(1);
	});

	it("rejects empty name", () => {
		expect(() =>
			Item.createNew({
				name: "   ",
				number: "1003",
				price: 10,
				categoryId: category.id,
			}),
		).toThrow(DomainValidationError);
	});

	it("rejects negative price", () => {
		expect(() =>
			Item.createNew({
				name: "Tea",
				number: "1004",
				price: -1,
				categoryId: category.id,
			}),
		).toThrow(DomainValidationError);
	});

	it("updates an existing item with validated fields", () => {
		const id = brand<string, "ItemId">(
			"018f3c8a-0000-7000-8000-000000000011",
		) as Item.Id;

		const item = Item.update({
			id,
			name: "  Espresso  ",
			number: "3001",
			price: 9,
			categoryId: category.id,
			specificationAssignments: [],
			isDeleted: false,
		});

		expect(item.id).toBe(id);
		expect(item.name).toBe("Espresso");
		expect(item.isDeleted).toBe(false);
	});
});
