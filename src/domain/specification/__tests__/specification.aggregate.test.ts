import { brand } from "@/lib/brand";
import { CategoryId } from "@/src/domain/category/category-id";
import { RequiredFieldError } from "@/src/domain/core/errors/validation.error";
import { Specification } from "@/src/domain/specification/aggregates/specification.aggregate";
import { SpecificationValueType } from "@/src/domain/specification/specification-value-type.enum";
import { StoreId } from "@/src/domain/store/store-id";

const CATEGORY_ID = brand<string, CategoryId>(
  "018f3c8a-0000-7000-8000-000000000020",
);
const STORE_ID = brand<string, StoreId>("018f3c8a-0000-7000-8000-000000000021");

describe("Specification aggregate", () => {
  it("creates a string specification with generated value ids", () => {
    const specification = Specification.create({
      name: "  Color  ",
      categoryId: CATEGORY_ID,
      storeId: STORE_ID,
      type: SpecificationValueType.STRING,
      isRequired: true,
      isPrimary: false,
      specificationValues: [{ value: "Red" }, { value: "Blue" }],
      generateValueId: () => "value-id-1",
    });

    expect(specification.name).toBe("Color");
    expect(specification.specificationValues).toHaveLength(2);
    expect(specification.specificationValues[0]?.id).toBe(
      brand<string, "SpecificationValueId">("value-id-1"),
    );
    expect(specification.isActive).toBe(true);
    expect(Object.isFrozen(specification)).toBe(true);
  });

  it("rejects values that do not match the boolean type", () => {
    expect(() =>
      Specification.create({
        name: "Flag",
        categoryId: CATEGORY_ID,
        storeId: STORE_ID,
        type: SpecificationValueType.BOOLEAN,
        isRequired: false,
        isPrimary: false,
        specificationValues: [{ value: "yes" }],
      }),
    ).toThrow("boolean");
  });

  it("rejects empty name", () => {
    expect(() =>
      Specification.create({
        name: "   ",
        categoryId: CATEGORY_ID,
        storeId: STORE_ID,
        type: SpecificationValueType.STRING,
        isRequired: false,
        isPrimary: false,
        specificationValues: [{ value: "Red" }],
      }),
    ).toThrow(RequiredFieldError);
  });
});
