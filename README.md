// features/inventory/domain/product.actions.ts

```
'use server'
import { createProduct } from './product.service'

export const createProductAction = async (input: CreateProductInput) => {
  return createProduct(input)
}
```

---

**Middlewares** → `server/middleware/`
Middleware is infrastructure, not a feature. It's reused across all features.

```
server/
└── middleware/
    ├── with-auth.ts
    ├── with-role.ts
    └── with-validation.ts
```

---

**Types** → co-located with the file that owns them.
`product.repository.ts` owns `ProductRepository` type. `product.schema.ts` owns `Product` type via `z.infer`. Only types used across 3+ features move to `shared/types.ts`.

---

**Utils & Lib** → you're right, one folder wins.

Feature-specific util is rare. When it happens, it usually means it's just a helper function that belongs inside the service or schema file itself — not a separate file. If it genuinely can't live inside any file, put it in `shared/utils.ts` anyway. The cost of one extra function in shared is lower than the cost of hunting through feature folders for utilities.

---

## Final Architecture

```
src/
│
├── app/
│   ├── api/
│   │   └── [feature]/route.ts
│   └── (dashboard)/
│       └── [feature]/page.tsx
│
├── features/
│   └── [feature]/
│       ├── domain/
│       │   ├── [entity].schema.ts
│       │   ├── [entity].types.ts
│       │   ├── [entity].repository.ts
│       │   ├── [entity].service.ts
│       │   ├── [entity].actions.ts
│       │   └── [entity].handler.ts
│       │
│       ├── ui/
│       │   ├── components/
│       │   │   └── [Entity]Form.tsx
│       │   └── hooks/
│       │       └── use[Entity].ts
│       │
│       ├── composition.ts
│       └── index.ts
│
├── server/
│   ├── db.ts
│   ├── env.ts
│   ├── errors.ts
│   ├── result.ts
│   └── middleware/
│       ├── with-auth.ts
│       ├── with-role.ts
│       └── with-validation.ts
│
├── shared/
│   ├── types.ts
│   ├── utils.ts
│   ├── schemas.ts
│   └── constants.ts
│
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   ├── modal.tsx
│   └── index.ts
│
└── config/
    └── app.config.ts
```

## The One Decision Rule

Who uses this file?

One feature, server-side → features/[name]/domain/
One feature, client-side → features/[name]/ui/
Route handler middleware → server/middleware/
DB, env, mailer, queue → server/
Pure util, 3+ features → shared/
Reusable UI component → ui/
Just a route or page → app/
# API Layer

This module handles all HTTP communication and server state management. It is split into two responsibilities: **fetching** and **caching**.

---

## Fetch

A thin wrapper around the native `fetch` API, providing a consistent interface for both server and client environments.

### Clients

Two pre-configured clients are exported based on the rendering context:

- **`serverApiClient`** — used in Server Components, Route Handlers, and Server Actions.
- **`clientApiClient`** — used in Client Components and browser event handlers.

Both expose the same `ApiClient` interface (`get`, `post`, `put`, `delete`), so they are interchangeable and injectable.

### 401 Handling

Any response with a `401 Unauthorized` status triggers an automatic redirect to the appropriate login page — determined by the current path.

| Context | Example path | Redirects to |
|---|---|---|
| Store dashboard | `/store/acme/...` | `/store/acme/login` |
| Other | `/admin/...` | `/login` |

This is handled transparently by the client, so call sites don't need to manage auth failures themselves.

### Cookie-Based Auth

Authentication relies entirely on cookies. The server client uses `credentials: "include"` by default, and forwards the user's session cookie when calling internal APIs from Server Components.

---

## React Query

Data fetching is organized in three layers, each with a single responsibility.

### 1. Query Keys

Defined as static constants using a hierarchical factory pattern. This ensures keys are consistent, type-safe, and easy to invalidate.

```ts
// constants/query-keys.ts
export const CATEGORY_QUERY_KEYS = {
  all: ["admin", "inventory", "categories"] as const,
  list: () => [...CATEGORY_QUERY_KEYS.all, "list"] as const,
  details: () => [...CATEGORY_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_QUERY_KEYS.details(), id] as const,
} as const;
```

### 2. Service Functions

Plain async functions that call the API. They accept an `ApiClient` as an injectable dependency, defaulting to `serverApiClient` so they work out of the box in server contexts.

```ts
// services/api/get-category-by-id.ts
export const getCategoryById = async (
  categoryId: string,
  apiClient: ApiClient = serverApiClient,
) => apiClient.get<Category>(`/api/v1/inventory/category/${categoryId}`);
```

### 3. Query Hooks

Each query exposes three exports built on top of the service function:

- **`buildGetXQueryOptions`** — a pure function that returns `queryOptions(...)`. Use this to prefetch in Server Components or loaders.
- **`useGetXQueryOptions`** — a hook wrapper around the builder. Use this when you need the options object inside a Client Component (e.g. to pass to `useSuspenseQuery`).
- **`useGetXQuery`** — the ready-to-use hook for Client Components.

```ts
// ui/hooks/use-get-category-by-id-query.ts
export const buildGetCategoryByIdQueryOptions = (
  categoryId: string,
  apiClient: ApiClient = serverApiClient,
) =>
  queryOptions({
    queryKey: CATEGORY_QUERY_KEYS.detail(categoryId),
    queryFn: () => getCategoryById(categoryId, apiClient),
  });

export const useGetCategoryByIdQueryOptions = (
  categoryId: string,
  apiClient: ApiClient = serverApiClient,
) => buildGetCategoryByIdQueryOptions(categoryId, apiClient);

export const useGetCategoryByIdQuery = (
  categoryId: string,
  apiClient: ApiClient = serverApiClient,
) => useQuery(useGetCategoryByIdQueryOptions(categoryId, apiClient));
```

### Dependency Injection

The `apiClient` parameter follows the same DI pattern across all three layers. This allows you to:

- **Swap clients per environment** — pass `clientApiClient` in a Client Component, `serverApiClient` in a server prefetch.
- **Inject mocks in tests** — pass a mock `ApiClient` without any module mocking.

In most cases you won't need to pass the client explicitly — the default (`serverApiClient`) is the right choice for server-side prefetching, and `clientApiClient` is passed explicitly only when calling from the browser.