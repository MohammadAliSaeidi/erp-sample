import {
  FilterInput,
  FilterSpec,
  StringFilterInput,
  NumberFilterInput,
  DateFilterInput,
  BooleanFilterInput,
} from "../types/filter.types";

type WhereCondition = Record<string, unknown>;

function buildStringCondition(
  field: string,
  input: StringFilterInput,
): WhereCondition {
  if (input.eq !== undefined) {
    return { [field]: { equals: input.eq } };
  }

  if (input.contains !== undefined) {
    return {
      [field]: {
        contains: input.contains,
        mode: "insensitive",
      },
    };
  }

  if (input.startsWith !== undefined) {
    return {
      [field]: {
        startsWith: input.startsWith,
        mode: "insensitive",
      },
    };
  }

  if (input.endsWith !== undefined) {
    return {
      [field]: {
        endsWith: input.endsWith,
        mode: "insensitive",
      },
    };
  }

  return {};
}

function buildNumberCondition(
  field: string,
  input: NumberFilterInput,
): WhereCondition {
  if (input.between) {
    return {
      [field]: {
        gte: input.between.from,
        lte: input.between.to,
      },
    };
  }

  const condition: Record<string, unknown> = {};
  
  if (input.eq !== undefined) condition.equals = input.eq;
  if (input.gt !== undefined) condition.gt = input.gt;
  if (input.gte !== undefined) condition.gte = input.gte;
  if (input.lt !== undefined) condition.lt = input.lt;
  if (input.lte !== undefined) condition.lte = input.lte;

  return Object.keys(condition).length > 0 
    ? { [field]: condition }
    : {};
}

function buildDateCondition(
  field: string,
  input: DateFilterInput,
): WhereCondition {
  if (input.eq) {
    return {
      [field]: {
        equals: input.eq,
      },
    };
  }

  if (input.before) {
    return {
      [field]: {
        lt: input.before,
      },
    };
  }

  if (input.after) {
    return {
      [field]: {
        gt: input.after,
      },
    };
  }

  if (input.between) {
    return {
      [field]: {
        gte: input.between.from,
        lte: input.between.to,
      },
    };
  }

  return {};
}

function buildBooleanCondition(
  field: string,
  input: BooleanFilterInput,
): WhereCondition {
  if (input.eq !== undefined) {
    return {
      [field]: {
        equals: input.eq,
      },
    };
  }
  return {};
}

export function buildPrismaWhere<
  TFilter extends Record<string, FilterInput>,
  TWhere,
>(
  filter: Partial<TFilter> | undefined,
  spec: FilterSpec<TFilter, TWhere>,
): TWhere {
  if (!filter) {
    return {} as TWhere;
  }

  const conditions: WhereCondition[] = [];

  for (const key of Object.keys(filter) as Array<keyof TFilter>) {
    const rule = spec[key];
    const value = filter[key];

    if (!rule || !value) {
      continue;
    }

    if (rule.toWhere) {
      const customCondition = rule.toWhere(value as never);
      conditions.push(customCondition as WhereCondition);
      continue;
    }

    if (!rule.dbField) {
      continue;
    }

    switch (rule.type) {
      case "string":
        conditions.push(
          buildStringCondition(rule.dbField, value as StringFilterInput),
        );
        break;

      case "number":
        conditions.push(
          buildNumberCondition(rule.dbField, value as NumberFilterInput),
        );
        break;

      case "date":
        conditions.push(
          buildDateCondition(rule.dbField, value as DateFilterInput),
        );
        break;

      case "boolean":
        conditions.push(
          buildBooleanCondition(rule.dbField, value as BooleanFilterInput),
        );
        break;
    }
  }

  if (conditions.length === 0) {
    return {} as TWhere;
  }

  return {
    AND: conditions,
  } as TWhere;
}
