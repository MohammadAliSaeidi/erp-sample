import {
  BooleanFilterInput,
  DateFilterInput,
  NumberFilterInput,
  StringFilterInput,
} from "../filter-inputs.types";

type Condition = Record<string, unknown>;

export function buildStringCondition(
  dbField: string,
  input: StringFilterInput
): Condition | null {
  if (input.eq !== undefined) return { [dbField]: { equals: input.eq } };
  if (input.contains !== undefined) return { [dbField]: { contains: input.contains, mode: "insensitive" } };
  return null;
}

export function buildNumberCondition(
  dbField: string,
  input: NumberFilterInput
): Condition | null {
  const ops: Record<string, unknown> = {};
  if (input.eq !== undefined) ops.equals = input.eq;
  if (input.gt !== undefined) ops.gt = input.gt;
  if (input.gte !== undefined) ops.gte = input.gte;
  if (input.lt !== undefined) ops.lt = input.lt;
  if (input.lte !== undefined) ops.lte = input.lte;
  return Object.keys(ops).length ? { [dbField]: ops } : null;
}

export function buildDateCondition(
  dbField: string,
  input: DateFilterInput
): Condition | null {
  const ops: Record<string, unknown> = {};
  if (input.eq !== undefined) ops.equals = input.eq;
  if (input.gt !== undefined) ops.gt = input.gt;
  if (input.gte !== undefined) ops.gte = input.gte;
  if (input.lt !== undefined) ops.lt = input.lt;
  if (input.lte !== undefined) ops.lte = input.lte;
  return Object.keys(ops).length ? { [dbField]: ops } : null;
}

export function buildBooleanCondition(
  dbField: string,
  input: BooleanFilterInput
): Condition | null {
  if (input.eq === undefined) return null;
  return { [dbField]: { equals: input.eq } };
}
