import { brand } from "@/lib/brand";
import { CategoryId } from "@/src/domain/category/category-id";
import { RequiredFieldError } from "@/src/domain/core/errors/validation.error";
import { Item } from "@/src/domain/item/aggregates/item.aggregate";
import { SpecificationId } from "@/src/domain/specification/specification-id";
import { SpecificationValueId } from "@/src/domain/specification/specification-value-id";

const CATEGORY_ID = brand<string, CategoryId>("018f3c8a-0000-7000-8000-000000000003");
const SPEC_ID = brand<string, SpecificationId>("018f3c8a-0000-7000-8000-000000000004");
const SPEC_VALUE_ID = brand<string, SpecificationValueId>(
  "018f3c8a-0000-7000-8000-000000000005",
);

describe("Item aggregate", () => {
  it("creates an item with normalized fields", () => {
    const item = Item.create({
      name: "  Latte  ",
      number: " 1001 ",
      price: 12.5,
      categoryId: CATEGORY_ID,
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
    expect(item.categoryId).toBe(CATEGORY_ID);
    expect(item.specificationAssignments).toHaveLength(1);
    expect(item.isDeleted).toBe(true);
    expect(Object.isFrozen(item)).toBe(true);
  });

  it("deduplicates specification assignments by specification id", () => {
    const item = Item.create({
      name: "Mocha",
      number: "1002",
      price: 15,
      categoryId: CATEGORY_ID,
      specificationAssignments: [
        {
          specificationId: SPEC_ID,
          specificationValueId: SPEC_VALUE_ID,
        },
        {
          specificationId: SPEC_ID,
          specificationValueId: brand<string, SpecificationValueId>(
            "018f3c8a-0000-7000-8000-000000000006",
          ),
        },
      ],
    });

    expect(item.specificationAssignments).toHaveLength(1);
  });

  it("rejects empty name", () => {
    expect(() =>
      Item.create({
        name: "   ",
        number: "1003",
        price: 10,
        categoryId: CATEGORY_ID,
      }),
    ).toThrow(RequiredFieldError);
  });

  it("rejects negative price", () => {
    expect(() =>
      Item.create({
        name: "Tea",
        number: "1004",
        price: -1,
        categoryId: CATEGORY_ID,
      }),
    ).toThrow("Invalid price");
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
      categoryId: CATEGORY_ID,
      specificationAssignments: [],
      isDeleted: false,
    });

    expect(item.id).toBe(id);
    expect(item.name).toBe("Espresso");
    expect(item.isDeleted).toBe(false);
  });
});
