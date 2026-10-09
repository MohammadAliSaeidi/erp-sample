import { brand, Brand } from "@/lib/brand";
import {
	DomainValidationCause,
	DomainValidationError,
} from "./errors/validation.error";

declare const EntitySealSymbol: unique symbol;

export type EntityId<Tag extends string> = Brand<string, `${Tag}Id`>;

export type SealedEntity<T, Tag extends string> = Readonly<
	T & {
		readonly [EntitySealSymbol]: Tag;
	}
>;

export type Entity<Props extends object, Tag extends string> = SealedEntity<
	{
		readonly id: EntityId<Tag>;
	} & Props,
	Tag
>;

export type EntityValidationIssues = readonly DomainValidationCause[];

export type EntityFactory<
	Props extends object,
	TEntity extends Entity<Props, Tag>,
	Tag extends string,
> = {
	readonly tag: Tag;
	create: (props: Props) => TEntity;
	fromPersistence: (
		persisted: { readonly id: EntityId<Tag> } & Props,
	) => TEntity;
	validate: (props: Props) => EntityValidationIssues;
	isValid: (props: Props) => boolean;
	seal: (entity: { readonly id: EntityId<Tag> } & Props) => TEntity;
};

export type CreateEntityFactoryConfig<
	Props extends object,
	TEntity extends Entity<Props, Tag>,
	Tag extends string,
> = {
	readonly tag: Tag;

	/**
	 * Validates raw construction props and returns structured validation causes.
	 *
	 * It returns causes instead of throwing so the factory can aggregate all
	 * validation problems into one `ValidationError`.
	 */
	readonly validate: (props: Props) => EntityValidationIssues;

	/**
	 * Builds the final entity shape after validation passed.
	 *
	 * This is the correct place for normalization such as trimming strings,
	 * lowercasing emails, deriving fields, or setting defaults.
	 */
	readonly build: (
		id: EntityId<Tag>,
		props: Props,
	) => { readonly id: EntityId<Tag> } & Props;

	/**
	 * Optional ID generator.
	 *
	 * Inject this in tests to make IDs deterministic. In production, the
	 * default uses `crypto.randomUUID()`.
	 */
	readonly generateId?: () => string;

	/**
	 * Controls whether data loaded from persistence should be revalidated.
	 *
	 * Use `true` when you do not fully trust persisted data, when migrations may
	 * have changed invariants, or when the DB can be modified externally.
	 *
	 * Use `false` for performance if the repository/storage boundary already
	 * guarantees valid data.
	 */
	readonly validateOnHydrate?: boolean;
};

const defaultGenerateId = (): string => crypto.randomUUID();

/**
 * Applies the phantom entity brand and freezes the object.
 *
 * The brand is compile-time only; it does not add runtime properties. Freezing
 * prevents accidental mutation during runtime.
 */
export const sealEntity = <T extends object, Tag extends string>(
	value: T,
): SealedEntity<T, Tag> => Object.freeze(value) as SealedEntity<T, Tag>;

const assertValid = (issues: EntityValidationIssues): void => {
	if (issues.length > 0) {
		throw new DomainValidationError(issues);
	}
};

/**
 * Creates a reusable factory for nominally-typed domain entities.
 *
 * The returned factory is the only intended construction path. This prevents
 * accidental creation of plain objects that merely look like valid domain
 * entities.
 */
export const createEntityFactory = <
	Props extends object,
	TEntity extends Entity<Props, Tag>,
	Tag extends string,
>(
	config: CreateEntityFactoryConfig<Props, TEntity, Tag>,
): EntityFactory<Props, TEntity, Tag> => {
	const {
		tag,
		validate,
		build,
		generateId = defaultGenerateId,
		validateOnHydrate = false,
	} = config;

	const seal = (entity: { readonly id: EntityId<Tag> } & Props): TEntity =>
		sealEntity<typeof entity, Tag>(entity) as TEntity;

	return {
		tag,
		validate,
		isValid: (props) => validate(props).length === 0,
		seal,
		create: (props) => {
			assertValid(validate(props));

			const id = brand<string, `${Tag}Id`>(
				generateId(),
			) as EntityId<Tag>;
			const entity = build(id, props);

			return seal(entity);
		},

		fromPersistence: (persisted) => {
			const { id, ...props } = persisted;

			if (validateOnHydrate) {
				assertValid(validate(props as Props));
			}

			const entity = build(id, props as Props);

			return seal(entity);
		},
	};
};

export type Aggregate<Props extends object, Tag extends string> = Entity<
	Props,
	Tag
>;

export type AggregateId<Tag extends string> = EntityId<Tag>;

/**
 * Semantic alias for aggregate factories.
 *
 * Technically, aggregates and entities use the same construction mechanism here.
 * The alias improves domain language without adding unnecessary runtime logic.
 */
export const createAggregateFactory = createEntityFactory;
export { DomainValidationError as ValidationError } from "./errors/validation.error";
