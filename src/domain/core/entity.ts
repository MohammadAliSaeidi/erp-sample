import { brand, Brand } from "@/lib/brand";
import {
  DomainValidationCause,
  ValidationError,
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
  readonly validate: (props: Props) => EntityValidationIssues;
  readonly build: (
    id: EntityId<Tag>,
    props: Props,
  ) => { readonly id: EntityId<Tag> } & Props;
  readonly generateId?: () => string;
  readonly validateOnHydrate?: boolean;
};

export { ValidationError };

const defaultGenerateId = (): string => crypto.randomUUID();

export const sealEntity = <T extends object, Tag extends string>(
  value: T,
): SealedEntity<T, Tag> => Object.freeze(value) as SealedEntity<T, Tag>;

const assertValid = (issues: EntityValidationIssues): void => {
  if (issues.length > 0) {
    throw new ValidationError(issues);
  }
};

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

      const id = brand<string, `${Tag}Id`>(generateId()) as EntityId<Tag>;
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

export const createAggregateFactory = createEntityFactory;
