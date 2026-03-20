import { Middleware } from "@/features/shared/types/middleware.type";
import { RouteHandler } from "@/features/shared/types/route-handler.type";

/**
 * Composes multiple middlewares into a single middleware.
 * Middlewares are applied from first to last.
 * @example
 * const wrappedHandler = compose(
 *   logger,
 *   requireAuth,
 *   withValidatedBody(schema)
 * )(actualHandler);
 */
export function compose(
  ...middlewares: Middleware[]
): <TContext = unknown>(
  handler: RouteHandler<TContext>,
) => RouteHandler<TContext> {
  return <TContext = unknown>(handler: RouteHandler<TContext>) => {
    // Start with the final handler
    let composedHandler = handler;

    // Apply middlewares from last to first (so they execute in the original order)
    for (let i = middlewares.length - 1; i >= 0; i--) {
      composedHandler = middlewares[i](composedHandler);
    }

    return composedHandler;
  };
}
