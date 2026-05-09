export type StringOperators = {
  eq?: string;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
};

export type NumberOperators = {
  eq?: number;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  between?: {
    from: number;
    to: number;
  };
};

export type BooleanOperators = {
  eq?: boolean;
};

export type DateOperators = {
  eq?: Date;
  before?: Date;
  after?: Date;
  between?: {
    from: Date;
    to: Date;
  };
};

export type EnumOperators<T extends string> = {
  eq?: T;
  in?: T[];
};

export type FilterInput =
  | StringOperators
  | NumberOperators
  | BooleanOperators
  | DateOperators
  | EnumOperators<string>;

export type FieldTypeMap = {
  string: StringOperators;
  number: NumberOperators;
  boolean: BooleanOperators;
  date: DateOperators;
  enum: EnumOperators<string>;
};

type WhereFieldKey<TWhere> = Extract<keyof TWhere, string>;

export type FilterFieldSpec<TFieldType extends keyof FieldTypeMap, TWhere> =
  | {
      type: TFieldType;
      dbField: WhereFieldKey<TWhere>;
      // if we have dbField, we can not have toWhere
      toWhere?: never;
    }
  | {
      type: TFieldType;
      toWhere: (input: FieldTypeMap[TFieldType]) => TWhere;
      // if we have toWhere, we can not have dbField
      dbField?: never;
    };

export type FilterSpec<TFilter extends Record<string, FilterInput>, TWhere> = {
  [K in keyof TFilter]: TFilter[K] extends StringOperators
    ? FilterFieldSpec<"string", TWhere>
    : TFilter[K] extends NumberOperators
      ? FilterFieldSpec<"number", TWhere>
      : TFilter[K] extends BooleanOperators
        ? FilterFieldSpec<"boolean", TWhere>
        : TFilter[K] extends DateOperators
          ? FilterFieldSpec<"date", TWhere>
        : TFilter[K] extends EnumOperators<infer E>
          ? FilterFieldSpec<"enum", TWhere> & { enumValues: readonly E[] }
          : never;
};

export type StringFilterInput = StringOperators;
export type NumberFilterInput = NumberOperators;
export type BooleanFilterInput = BooleanOperators;
export type DateFilterInput = DateOperators;
