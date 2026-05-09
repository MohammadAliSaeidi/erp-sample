// The central contract that ties together filter schema, filter spec, and the target Prisma model

import { z } from "zod";
import { PaginationInput } from "./pagination.types";
import { FilterInput, FilterSpec } from "./filter.types";

export type QueryInput<TFilter extends Record<string, FilterInput>> = {
  filter?: Partial<TFilter>;
  pagination?: PaginationInput;
};

export type QueryDefinition<
  TFilter extends Record<string, FilterInput>,
  TWhere,
> = {
  filterSchema: z.ZodType<Partial<TFilter>>;
  filterSpec: FilterSpec<TFilter, TWhere>;
  paginationSchema: z.ZodType<PaginationInput>;
};
