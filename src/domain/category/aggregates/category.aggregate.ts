import {
	Aggregate as AggregateBase,
	AggregateId,
	createAggregateFactory,
} from "@/src/domain/core/entity";
import { DomainRequiredFieldError } from "@/src/domain/core/errors/validation.error";

export namespace Category {
	export type Data = Readonly<{
		name: string;
		description: string | null;
	}>;

	export type Tag = "Category";
	export type Aggregate = AggregateBase<Data, Tag>;
	export type Id = AggregateId<Tag>;

	type CreateProps = {
		name: string;
		description?: string | null;
	};

	type RehydrateProps = CreateProps & {
		id: Id;
	};

	export const factory = createAggregateFactory<Data, Aggregate, Tag>({
		tag: "Category",
		validate: () => [],
		build: (id, props) => ({
			id,
			...props,
		}),
	});

	export function create(props: CreateProps): Aggregate {
		if (!props.name?.trim()) {
			throw new DomainRequiredFieldError("name");
		}

		return factory.create({
			name: props.name.trim(),
			description: props.description ?? null,
		});
	}

	export function rehydrate(props: RehydrateProps): Aggregate {
		return factory.fromPersistence({
			id: props.id,
			name: props.name.trim(),
			description: props.description ?? null,
		});
	}

	export function update(props: RehydrateProps): Aggregate {
		if (!props.name?.trim()) {
			throw new DomainRequiredFieldError("name");
		}

		return factory.fromPersistence({
			id: props.id,
			name: props.name.trim(),
			description: props.description ?? null,
		});
	}

	export function withChanges(
		entity: Aggregate,
		patch: Partial<Data>,
	): Aggregate {
		return factory.fromPersistence({
			id: entity.id,
			name: entity.name,
			description: entity.description,
			...patch,
		});
	}
}
