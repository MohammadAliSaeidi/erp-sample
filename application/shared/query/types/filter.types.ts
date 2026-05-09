export type StringFilterInput = {
  eq?: string;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
};

export type NumberFilterInput = {
  eq?: number;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  between?: { from: number; to: number };
};

export type DateFilterInput = {
  eq?: Date;
  before?: Date;
  after?: Date;
  between?: { from: Date; to: Date };
};

export type BooleanFilterInput = {
  eq?: boolean;
};

export type FilterInput =
  | StringFilterInput
  | NumberFilterInput
  | DateFilterInput
  | BooleanFilterInput;

export type FilterType = "string" | "number" | "date" | "boolean";

// Mapping filter type to input type
export type FilterInputByType = {
  string: StringFilterInput;
  number: NumberFilterInput;
  date: DateFilterInput;
  boolean: BooleanFilterInput;
};

// Filter rule definition
export type FilterRule<TWhere, TType extends FilterType> = {
  type: TType;
  dbField?: string;
  toWhere?: (input: FilterInputByType[TType]) => TWhere | Partial<TWhere>;
};

// Complete filter specification
export type FilterSpec<TFilter extends Record<string, FilterInput>, TWhere> = {
  [K in keyof TFilter]?: TFilter[K] extends StringFilterInput
    ? FilterRule<TWhere, "string">
    : TFilter[K] extends NumberFilterInput
      ? FilterRule<TWhere, "number">
      : TFilter[K] extends DateFilterInput
        ? FilterRule<TWhere, "date">
        : TFilter[K] extends BooleanFilterInput
          ? FilterRule<TWhere, "boolean">
          : never;
};
