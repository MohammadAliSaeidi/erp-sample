import { z } from "zod";
import {
  FieldTypeMap,
  FilterFieldSpec,
  FilterInput,
  FilterSpec,
} from "../types/filter.types";
import { QueryDefinition } from "../types/query.types";
import { paginationSchema } from "../schema/pagination.schema";
import {
  booleanFilterSchema,
  dateFilterSchema,
  enumFilterSchema,
  numberFilterSchema,
  stringFilterSchema,
} from "../schema/filter.schemas";

/**
 * Single factory that creates a cohesive `QueryDefinition`:
 *
 * **Why a single factory?**
 * - Eliminates the need for separate `defineFilterSchema`, `defineFilterMap`, `defineFilterSpec`
 * - Schema and spec are always in sync — no drift
 * - One place to add a field, one place to remove it
 */
export function defineQuery<
  TFilter extends Record<string, FilterInput>,
  TWhere,
>() {
  return <TFilterExact extends TFilter>(config: {
    filterSchema: z.ZodType<{ [K in keyof TFilterExact]?: TFilterExact[K] }>;
    filterSpec: FilterSpec<TFilterExact, TWhere>;
  }): QueryDefinition<TFilterExact, TWhere> => ({
    ...config,
    paginationSchema,
  });
}

type QueryFieldConfig<TWhere> =
  | ({ type: "string" } & FilterFieldSpec<"string", TWhere>)
  | ({ type: "number" } & FilterFieldSpec<"number", TWhere>)
  | ({ type: "boolean" } & FilterFieldSpec<"boolean", TWhere>)
  | ({ type: "date" } & FilterFieldSpec<"date", TWhere>)
  | ({ type: "enum"; enumValues: readonly string[] } & FilterFieldSpec<
      "enum",
      TWhere
    >);

export type FilterFromFields<
  TFields extends Record<string, { type: keyof FieldTypeMap }>,
> = {
  [K in keyof TFields]: TFields[K] extends { type: infer TType }
    ? TType extends keyof FieldTypeMap
      ? FieldTypeMap[TType]
      : never
    : never;
};

function makeFilterSchema<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFields extends Record<string, QueryFieldConfig<any>>,
>(fields: TFields) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const [name, field] of Object.entries(fields)) {
    switch (field.type) {
      case "string":
        shape[name] = stringFilterSchema.optional();
        break;
      case "number":
        shape[name] = numberFilterSchema.optional();
        break;
      case "boolean":
        shape[name] = booleanFilterSchema.optional();
        break;
      case "date":
        shape[name] = dateFilterSchema.optional();
        break;
      case "enum":
        shape[name] = enumFilterSchema(field.enumValues).optional();
        break;
    }
  }

  return z.object(shape) as z.ZodType<{
    [K in keyof FilterFromFields<TFields>]?: FilterFromFields<TFields>[K];
  }>;
}

function makeFilterSpec<
  TFields extends Record<string, QueryFieldConfig<TWhere>>,
  TWhere,
>(fields: TFields): FilterSpec<FilterFromFields<TFields>, TWhere> {
  const spec: Record<string, unknown> = {};

  for (const [name, field] of Object.entries(fields)) {
    if (field.type === "enum") {
      spec[name] = {
        type: field.type,
        enumValues: field.enumValues,
        ...(field.dbField ? { dbField: field.dbField } : {}),
        ...(field.toWhere ? { toWhere: field.toWhere } : {}),
      };
      continue;
    }

    spec[name] = {
      type: field.type,
      ...(field.dbField ? { dbField: field.dbField } : {}),
      ...(field.toWhere ? { toWhere: field.toWhere } : {}),
    };
  }

  return spec as FilterSpec<FilterFromFields<TFields>, TWhere>;
}

export function defineQueryFromFields<TWhere>() {
  return <TFields extends Record<string, QueryFieldConfig<TWhere>>>(
    fields: TFields,
  ): QueryDefinition<FilterFromFields<TFields>, TWhere> => {
    const filterSchema = makeFilterSchema(fields);
    const filterSpec = makeFilterSpec<TFields, TWhere>(fields);

    return {
      filterSchema,
      filterSpec,
      paginationSchema,
    };
  };
}
