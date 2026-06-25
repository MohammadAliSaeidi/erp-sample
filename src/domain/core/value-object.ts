import { DomainValidationCause, ValidationError } from "./errors/validation.error";

declare const ValueObjectSealSymbol: unique symbol;

export type SealedValueObject<T, Tag extends string> = Readonly<
  T & {
    readonly [ValueObjectSealSymbol]: Tag;
  }
>;

export type ValueObject<
  Props extends object,
  Tag extends string,
> = SealedValueObject<Props, Tag>;

export type ValueObjectValidationIssues = readonly DomainValidationCause[];

export type ValueObjectFactory<
  Props extends object,
  TValueObject extends ValueObject<Props, Tag>,
  Tag extends string,
> = {
  readonly tag: Tag;
  create: (props: Props) => TValueObject;
  fromPersistence: (props: Props) => TValueObject;
  validate: (props: Props) => ValueObjectValidationIssues;
  isValid: (props: Props) => boolean;
  seal: (props: Props) => TValueObject;
};

export type CreateValueObjectFactoryConfig<
  Props extends object,
  TValueObject extends ValueObject<Props, Tag>,
  Tag extends string,
> = {
  readonly tag: Tag;
  readonly validate: (props: Props) => ValueObjectValidationIssues;
  readonly build: (props: Props) => Props;
  readonly validateOnHydrate?: boolean;
};

export const sealValueObject = <T extends object, Tag extends string>(
  value: T,
): SealedValueObject<T, Tag> =>
  Object.freeze(value) as SealedValueObject<T, Tag>;

const assertValid = (issues: ValueObjectValidationIssues): void => {
  if (issues.length > 0) {
    throw new ValidationError(issues);
  }
};

export const createValueObjectFactory = <
  Props extends object,
  TValueObject extends ValueObject<Props, Tag>,
  Tag extends string,
>(
  config: CreateValueObjectFactoryConfig<Props, TValueObject, Tag>,
): ValueObjectFactory<Props, TValueObject, Tag> => {
  const { tag, validate, build, validateOnHydrate = true } = config;

  const seal = (props: Props): TValueObject =>
    sealValueObject<Props, Tag>(props) as TValueObject;

  return {
    tag,
    validate,
    isValid: (props) => validate(props).length === 0,
    seal,
    create: (props) => {
      assertValid(validate(props));

      return seal(build(props));
    },
    fromPersistence: (props) => {
      if (validateOnHydrate) {
        assertValid(validate(props));
      }

      return seal(build(props));
    },
  };
};
