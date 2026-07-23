import { uniq } from "@/lib/uniq/uniq";
import {
  Aggregate as AggregateBase,
  AggregateId,
  createAggregateFactory,
} from "@/src/domain/core/entity";
import {
  DomainValidationCause,
  InvalidAmountError,
  RequiredFieldError,
  ValidationError,
} from "@/src/domain/core/errors/validation.error";
import { SpecificationId } from "@/src/domain/specification/specification-id";
import { SpecificationValueId } from "@/src/domain/specification/specification-value-id";
import { Category } from "../../category/aggregates/category.aggregate";

export namespace Item {
  export type ItemSpecificationAssignment = Readonly<{
    specificationId: SpecificationId;
    specificationValueId: SpecificationValueId;
  }>;

  export type Data = Readonly<{
    name: string;
    number: string;
    description: string | null;
    price: number;
    categoryId?: Category.Id;
    specificationAssignments: readonly ItemSpecificationAssignment[];
    isDeleted: boolean;
  }>;

  export type Tag = "Item";
  export type Aggregate = AggregateBase<Data, Tag>;
  export type Id = AggregateId<Tag>;

  export type CreateProps = {
    name: string;
    number: string;
    description?: string | null;
    price: number;
    categoryId?: Category.Id;
    specificationAssignments?: readonly ItemSpecificationAssignment[];
    isDeleted?: boolean;
  };

  export type RestoreProps = CreateProps & { id: Id };

  type Mode = "create" | "restore" | "update";

  const factory = createAggregateFactory<Data, Aggregate, Tag>({
    tag: "Item",
    validate: () => [],
    build: (id, props) => ({ id, ...props }),
  });

  function normalizeAssignments(
    assignments: readonly ItemSpecificationAssignment[] = [],
  ): readonly ItemSpecificationAssignment[] {
    return uniq(
      assignments.map((a) => ({
        specificationId: a.specificationId,
        specificationValueId: a.specificationValueId,
      })),
      (a) => a.specificationId,
    );
  }

  function normalize(props: CreateProps, mode: Mode): Data {
    return {
      name: props.name?.trim() ?? "",
      number: props.number?.trim() ?? "",
      description: props.description ?? null,
      price: props.price,
      categoryId: props.categoryId,
      specificationAssignments: normalizeAssignments(
        props.specificationAssignments,
      ),
      isDeleted: props.isDeleted ?? mode === "create",
    };
  }

  function validate(data: Data): void {
    const issues: DomainValidationCause[] = [];

    if (!data.name) issues.push(new RequiredFieldError("name"));
    if (!data.number) issues.push(new RequiredFieldError("number"));

    if (
      data.price === undefined ||
      Number.isNaN(data.price) ||
      data.price < 0
    ) {
      issues.push(new InvalidAmountError("price", "Invalid price"));
    }

    if (!data.categoryId) issues.push(new RequiredFieldError("categoryId"));

    if (issues.length) throw new ValidationError(issues);
  }

  function buildForWrite(props: CreateProps, mode: Mode): Data {
    const data = normalize(props, mode);
    validate(data);
    return data;
  }

  /** Create brand-new Item. Generates id. */
  export function createNew(props: CreateProps): Aggregate {
    return factory.create(buildForWrite(props, "create"));
  }

  /** Restore Item from persistence using existing id. */
  export function restore(props: RestoreProps): Aggregate {
    return factory.fromPersistence({
      id: props.id,
      ...buildForWrite(props, "restore"),
    });
  }

  /** Update existing Item (immutable style). */
  export function update(props: RestoreProps): Aggregate {
    return factory.fromPersistence({
      id: props.id,
      ...buildForWrite(props, "update"),
    });
  }
}
