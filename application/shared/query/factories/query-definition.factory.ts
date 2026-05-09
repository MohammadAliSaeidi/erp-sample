import { z } from "zod";
import { FilterInput, FilterSpec } from "../types/filter.types";
import { QueryDefinition } from "../types/query.types";
import { paginationSchema } from "../schema/pagination.schema";

export function defineQuery<
  TFilter extends Record<string, FilterInput>,
  TWhere,
>() {
  return (config: {
    filterSchema: z.ZodType<Partial<TFilter>>;
    filterSpec: FilterSpec<TFilter, TWhere>;
  }): QueryDefinition<TFilter, TWhere> => ({
    ...config,
    paginationSchema,
  });
}
