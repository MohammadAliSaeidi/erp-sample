export type StringFilterInput = { eq?: string; contains?: string };
export type NumberFilterInput = { eq?: number; gt?: number; gte?: number; lt?: number; lte?: number };
export type BooleanFilterInput = { eq?: boolean };
export type DateFilterInput = { eq?: Date; gt?: Date; gte?: Date; lt?: Date; lte?: Date };

export type PrimitiveFilterType = "string" | "number" | "boolean" | "date";
