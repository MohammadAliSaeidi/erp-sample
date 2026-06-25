import { brand } from "@/lib/brand";
import {
  createEntityFactory,
  Entity,
  EntityId,
  ValidationError,
} from "@/src/domain/core/entity";
import { RequiredFieldError } from "@/src/domain/core/errors/validation.error";

type TestData = Readonly<{
  name: string;
}>;

type TestTag = "TestEntity";

type TestEntity = Entity<TestData, TestTag>;

const testFactory = createEntityFactory<TestData, TestEntity, TestTag>({
  tag: "TestEntity",
  validate: (props) => {
    if (!props.name?.trim()) {
      return [new RequiredFieldError("name")];
    }
    return [];
  },
  build: (id, props) => ({
    id,
    name: props.name.trim(),
  }),
  generateId: () => "test-id-1",
});

describe("createEntityFactory", () => {
  it("creates a sealed entity with a branded id", () => {
    const entity = testFactory.create({ name: "  Widget  " });

    expect(entity.id).toBe(brand<string, "TestEntityId">("test-id-1"));
    expect(entity.name).toBe("Widget");
    expect(Object.isFrozen(entity)).toBe(true);
  });

  it("aggregates validation issues into ValidationError", () => {
    expect(() => testFactory.create({ name: "   " })).toThrow(ValidationError);
  });

  it("rehydrates from persistence without re-validating by default", () => {
    const id = brand<string, "TestEntityId">("persisted-id") as EntityId<TestTag>;

    const entity = testFactory.fromPersistence({ id, name: "" });

    expect(entity.id).toBe(id);
    expect(entity.name).toBe("");
  });
});
