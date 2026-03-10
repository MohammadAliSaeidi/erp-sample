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

One feature, server-side     →  features/[name]/domain/
One feature, client-side     →  features/[name]/ui/
Route handler middleware      →  server/middleware/
DB, env, mailer, queue        →  server/
Pure util, 3+ features        →  shared/
Reusable UI component         →  ui/
Just a route or page          →  app/