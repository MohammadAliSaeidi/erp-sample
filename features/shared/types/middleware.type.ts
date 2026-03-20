import { RouteHandler } from "@/features/shared/types/route-handler.type";

export type Middleware = <TContext = unknown>(
  handler: RouteHandler<TContext>,
) => RouteHandler<TContext>;