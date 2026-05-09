import {
  buildBooleanCondition,
  buildDateCondition,
  buildNumberCondition,
  buildStringCondition,
} from "./builders/default-condition-builders";
import { FilterSpec } from "./types/filter.types";


type Condition = Record<string, unknown>;

type RuleInput<TRule> = TRule extends { toWhere?: (input: infer I) => unknown }
  ? I
  : never;

export function buildPrismaWhere<TFilter extends object, TWhere extends object>(
  filter: Partial<TFilter> | undefined,
  spec: FilterSpec<TFilter, TWhere>,
): TWhere {
  const andConditions: Condition[] = [];
  if (!filter) return {} as TWhere;

  const keys = Object.keys(filter) as Array<keyof TFilter>;

  for (const key of keys) {
    const rule = spec[key];
    const value = filter[key];

    if (!rule || value === undefined || value === null) continue;

    if (rule.toWhere) {
      type Input = RuleInput<typeof rule>;
      andConditions.push(rule.toWhere(value as Input) as unknown as Condition);
      continue;
    }

    if (!rule.dbField) continue;

    let condition: Condition | null = null;

      switch (rule.type) {
        case "string":
          condition = buildStringCondition(
            rule.dbField,
            value as Parameters<typeof buildStringCondition>[1],
          );
          break;

        case "number":
          condition = buildNumberCondition(
            rule.dbField,
            value as Parameters<typeof buildNumberCondition>[1],
          );
          break;

        case "date":
          condition = buildDateCondition(
            rule.dbField,
            value as Parameters<typeof buildDateCondition>[1],
          );
          break;

        case "boolean":
          condition = buildBooleanCondition(
            rule.dbField,
            value as Parameters<typeof buildBooleanCondition>[1],
          );
          break;
      }

    if (condition) andConditions.push(condition);
  }

  if (!andConditions.length) return {} as TWhere;
  return { AND: andConditions } as unknown as TWhere;
}
