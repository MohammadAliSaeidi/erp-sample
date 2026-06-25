import { uniq } from "@/lib/uniq/uniq";
import { CategoryId } from "@/src/domain/category/category-id";
import {
  Aggregate as AggregateBase,
  AggregateId,
  createAggregateFactory,
} from "@/src/domain/core/entity";
import {
  InvalidAmountError,
  RequiredFieldError,
} from "@/src/domain/core/errors/validation.error";
import { SpecificationId } from "@/src/domain/specification/specification-id";
import { SpecificationValueId } from "@/src/domain/specification/specification-value-id";

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
    categoryId: CategoryId;
    specificationAssignments: readonly ItemSpecificationAssignment[];
    isDeleted: boolean;
  }>;

  export type Tag = "Item";
  export type Aggregate = AggregateBase<Data, Tag>;
  export type Id = AggregateId<Tag>;

  type CreateProps = {
    name: string;
    number: string;
    description?: string | null;
    price: number;
    categoryId: CategoryId;
    specificationAssignments?: readonly ItemSpecificationAssignment[];
    isDeleted?: boolean;
  };

  type RehydrateProps = CreateProps & {
    id: Id;
  };

  export const factory = createAggregateFactory<Data, Aggregate, Tag>({
    tag: "Item",
    validate: () => [],
    build: (id, props) => ({
      id,
      ...props,
    }),
  });

  function normalizeAssignments(
    assignments: readonly ItemSpecificationAssignment[] = [],
  ): readonly ItemSpecificationAssignment[] {
    return uniq(
      assignments.map((assignment) => ({
        specificationId: assignment.specificationId,
        specificationValueId: assignment.specificationValueId,
      })),
      (assignment) => assignment.specificationId,
    );
  }

  export function create(props: CreateProps): Aggregate {
    if (!props.name?.trim()) {
      throw new RequiredFieldError("name");
    }

    if (!props.number?.trim()) {
      throw new RequiredFieldError("number");
    }

    if (
      props.price === undefined ||
      Number.isNaN(props.price) ||
      props.price < 0
    ) {
      throw new InvalidAmountError("price", "Invalid price");
    }

    if (!props.categoryId) {
      throw new RequiredFieldError("categoryId");
    }

    return factory.create({
      name: props.name.trim(),
      number: props.number.trim(),
      description: props.description ?? null,
      price: props.price,
      categoryId: props.categoryId,
      specificationAssignments: normalizeAssignments(
        props.specificationAssignments,
      ),
      isDeleted: props.isDeleted ?? true,
    });
  }

  export function rehydrate(props: RehydrateProps): Aggregate {
    return factory.fromPersistence({
      id: props.id,
      name: props.name.trim(),
      number: props.number.trim(),
      description: props.description ?? null,
      price: props.price,
      categoryId: props.categoryId,
      specificationAssignments: normalizeAssignments(
        props.specificationAssignments,
      ),
      isDeleted: props.isDeleted ?? false,
    });
  }

  export function update(props: RehydrateProps): Aggregate {
    if (!props.name?.trim()) {
      throw new RequiredFieldError("name");
    }

    if (!props.number?.trim()) {
      throw new RequiredFieldError("number");
    }

    if (
      props.price === undefined ||
      Number.isNaN(props.price) ||
      props.price < 0
    ) {
      throw new InvalidAmountError("price", "Invalid price");
    }

    if (!props.categoryId) {
      throw new RequiredFieldError("categoryId");
    }

    return rehydrate(props);
  }
}
