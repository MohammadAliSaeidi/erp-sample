import { z } from "zod";
import { FilterInput, FilterSpec } from "../types/filter.types";
import { QueryDefinition } from "../types/query.types";
import { paginationSchema } from "../schema/pagination.schema";

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