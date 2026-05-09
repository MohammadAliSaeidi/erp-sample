# Dynamic Query Filtering System

A type-safe, generic filtering pipeline built for Next.js + Prisma projects following DDD-lite / Hexagonal architecture principles.

---

## Overview

This system provides a structured, end-to-end flow for handling dynamic filters from HTTP request parameters down to Prisma database queries.

Request Params → Zod Validation → QueryDefinition → buildPrismaWhere() → Prisma Query → Mapper → DTO

---

## Full Data Flow

### Step 1 — Request arrives (Server Action / API Route)

``` typescript
// app/api/items/route.ts
const raw = Object.fromEntries(new URL(request.url).searchParams);
```

### Step 2 — Validate with Zod

``` typescript
const input = itemListQueryInputSchema.parse(raw);
// throws ZodError with structured messages if invalid
```

### Step 3 — Usecase

``` typescript
// get-items-list.usecase.ts
async execute(input: ItemListQueryInput) {
  return this.itemQueryPort.findMany(input);
}
```

### Step 4 — Repository Adapter

``` typescript
// item-query.adapter.ts
async findMany(query: ItemListQueryInput) {
  const where = buildPrismaWhere(query, itemListQuery);

  const items = await prisma.item.findMany({
    where: { storeId, deletedAt: null, AND: [where] },
    include: itemWithRelationsInclude,skip: ((query.pagination?.page ?? 1) - 1) * (query.pagination?.limit ?? 20),
    take: query.pagination?.limit ?? 20,
  });

  return items.map(itemPrismaToDTOMapper.map);
}
```

### Step 5 — Mapper

```typescript
// item-prisma-to-dto.mapper.ts
map(item: ItemWithRelations): ItemDTO {
  return {
    id: item.id,
    name: item.name,
    price: item.price.toNumber(),
    specifications: item.itemSpecificationValues.map(sv => ({
      name: sv.specification.name,
      value: sv.specificationValue?.value ?? sv.textValue,
    })),
  };
}
```

---

## Supported Filter Operators

| Type    | Operators|
|---------|------------------------------------------------|
| string  | `equals`, `contains`, `startsWith`, `endsWith` |
| number  | `equals`, `gt`, `gte`, `lt`, `lte`, `between`  |
| boolean | `equals`                                       |
| enum    | `equals`, `in`                                 |

---

## Adding a New Filter Field

1. Add the field to `defineQuery` fields config
2. That's it — schema and spec update automatically

``` typescript
// Before
fields: { name: { type: 'string', prismaField: 'name' } }

// After
fields: {
  name:     { type: 'string', prismaField: 'name' },
  category: { type: 'string', prismaField: 'categoryId' },  // ← added
}
```
---

## Removed / Replaced Files

| Old File                    | Replaced By                          |
|-----------------------------|--------------------------------------|
| `define-filter-schema.ts`   | `defineQuery()` factory              |
| `define-filter-map.ts`      | removed (merged into `defineQuery`)  |
| `define-filter-spec.ts`     | `defineQuery()` factory              |
| `default-condition-builders.ts` | `prisma-where.builder.ts`        |
| `filter-inputs.types.ts`    | `filter.types.ts`                    |
| `filters.types.ts`          | `filter.types.ts`                    |

---

## Design Principles

| Principle   | Application|
|-------------|--------------------------------------------------------------------------|
| **SRP**     | Each file has one job: types, schema, builder, adapter, mapper           |
| **DRY**     | `defineQuery` is the single source of truth for a feature's filter shape |
| **DI**      | Usecase depends on port interface, not Prisma directly|
| **SoC**     | Validation, query building, and data mapping are fully separated         |
| **KISS**    | No abstract base classes; plain functions and objects                    |
| **Type Safety** | No `any` casts; `satisfies` and `Prisma.ItemGetPayload` enforce correctness |
