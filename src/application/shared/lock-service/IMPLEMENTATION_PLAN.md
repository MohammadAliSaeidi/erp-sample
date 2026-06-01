# Realtime Edit Lock — Implementation Plan

This document is the **single source of truth** for completing the item (and later category) edit-lock feature. It complements [README.md](./README.md) (architecture) and [FLOW.mermaid](./FLOW.mermaid) (sequence).

**Method:** Kent Beck TDD — one behavior at a time, failing test first, smallest change to green, then refactor.

**Order:** Happy path and contract alignment first, then edge cases, then UI/WS hardening.

---

## Definition of Done

The feature is **done** when all of the following are true in a staging environment with Redis + `ws-server` running.

### User-visible behavior

| # | Criterion | How to verify |
|---|-----------|---------------|
| 1 | Admin A opens item edit → acquires lock, can edit | Manual + automated acquire test |
| 2 | Admin B (same store) opens same item → sees locked state, cannot acquire | Denied result + `item.lock.denied` event |
| 3 | Admin B sees who holds the lock (admin id or display name) | WS payload / UI |
| 4 | Admin A saves or leaves edit → lock released | `item.unlocked` + B can acquire |
| 5 | Lock expires if A crashes or stops refreshing | TTL frees lock; optional `item.lock.expired` |
| 6 | Store A never receives store B lock events | Integration test / two stores |

### Technical contracts

| # | Criterion |
|---|-----------|
| 7 | `LockServicePort`, Redis adapter, and use cases agree on **signatures and return shapes** (`lockToken`, `{ ok: boolean }` on release) |
| 8 | Redis release/refresh use **atomic Lua** comparing the same field stored at acquire (`lockToken`) |
| 9 | Acquire / refresh / release use cases covered by **behavior tests** (not snapshot-only) |
| 10 | Redis adapter covered by **integration-style tests** (in-memory or test Redis) |
| 11 | One **transport** wired: server action or API route calling `runUsecase` for acquire, refresh, release |
| 12 | Client: WS connect → join store + item rooms → call acquire → listen for lock events → refresh on interval → release on unmount |
| 13 | Events flow: app publishes to Redis channel → `ws-server` subscribes → emits to `store:{storeId}:item:{itemId}` |
| 14 | No duplicate event paths (Redis pub/sub only; `buildWsEventPublisher` unused or removed) |
| 15 | WS `join-store` / `join-item` validate tenant (storeId matches authenticated admin) |

### Explicitly out of scope (v1)

- Category locks (planned as Phase 6 — same pattern as item)
- Optimistic editing without lock (merge/conflict resolution)
- Global admin override / force-unlock UI
- Multi-region Redis Redlock

---

## Current state (baseline)

| Area | Status |
|------|--------|
| Generic use cases (`buildAcquireLockUsecase`, etc.) | Implemented + tested |
| Item wrappers | Implemented + tested |
| `LockServicePort` vs use case vs adapter | **Misaligned** (release arity, refresh arity, return types) |
| Redis adapter Lua | **Bug:** compares `data["token"]`, stores `lockToken` |
| Redis adapter tests | Placeholders only → **first real test added** (see Phase 1) |
| API / server actions | **Not wired** |
| Client WS listeners / lock UI | **Not wired** (`socket-client` unused) |
| `item.lock.expired` event | Not in registry |
| Category locks | Not started |

---

## TDD task breakdown

Each task follows: **Red** (failing test) → **Green** (minimal code) → **Refactor** (only when green).

### Phase 0 — Documentation and contracts (this file)

| ID | Task | Red | Green |
|----|------|-----|-------|
| 0.1 | Write `IMPLEMENTATION_PLAN.md` | — | Done |
| 0.2 | Link from `README.md` | — | Done |
| 0.3 | Freeze canonical field names: `lockToken` in Redis JSON, `token` in event payloads per `EventRegistry` | — | Team agreement in this doc |

**Canonical contract (target):**

```ts
// LockServicePort (target)
acquire(key, storeAdminId, ttlMs): Promise<LockResult>
release(key, lockToken): Promise<UnlockResult>  // token-only; no actorAdminId
refresh(key, lockToken, ttlMs): Promise<boolean>
get(key): Promise<LockResult | null>  // null = unlocked; do not imply caller owns lock
```

---

### Phase 1 — Redis adapter (happy path foundation)

> **Start here.** Everything upstream assumes the adapter is correct.

| ID | Behavior (test name) | File |
|----|----------------------|------|
| 1.1 | `acquire` on empty key → `{ ok: true, lockToken, lockedBy, expiresAt }` | `redis-lock-service.adapter.test.ts` |
| 1.2 | second `acquire` → `{ ok: false, lockedBy, expiresAt }` | same |
| 1.3 | `release` with token from acquire → `{ ok: true }`, key absent | same ← **first test to implement** |
| 1.4 | `release` with wrong token → `{ ok: false }`, key still held | same |
| 1.5 | `refresh` with correct token → `true`, TTL extended | same |
| 1.6 | `refresh` with wrong token → `false` | same |

**Refactor after 1.1–1.6:**

| ID | Task |
|----|------|
| 1.7 | Remove stray `describe` inside `redis-lock-service.adapter.ts` |
| 1.8 | Align `LockServicePort` with token-only `release` / `refresh` |
| 1.9 | Fix `release-lock.usecase` / tests if port signature changes |
| 1.10 | Fix `lock-usecase-test.helpers`: `lockResultOk` uses `lockToken` not `token` |
| 1.11 | Align Lua scripts: use `lockToken` consistently |

---

### Phase 2 — Use case layer (happy path, already mostly green)

Re-run and fix any tests broken by Phase 1 port changes.

| ID | Behavior | File |
|----|----------|------|
| 2.1 | Acquire publishes `item.locked` with `token` in payload | existing tests |
| 2.2 | Denied publishes `item.lock.denied` | existing tests |
| 2.3 | Release publishes `item.unlocked` / `item.unlock.denied` | existing tests |
| 2.4 | Refresh returns `{ ok: true \| false }` | `refresh-lock.usecase.test.ts` — fix expected `refresh()` args |

| ID | Task |
|----|------|
| 2.5 | Wire `buildReleaseEditItemLockUsecase` + `buildRefreshItemLockUsecase` default exports with Redis deps (mirror acquire) |

---

### Phase 3 — Interface layer (first vertical slice)

| ID | Behavior | Red |
|----|----------|-----|
| 3.1 | Server action `acquireEditItemLock` returns `ActionResult` with lock token | Test controller/action with mocked use case |
| 3.2 | Same for `releaseEditItemLock`, `refreshItemLock` | |
| 3.3 | Permission `items:update` enforced via `runUsecase` | Existing `behavesLikeAuthenticatedUsecase` on item builders |

---

### Phase 4 — Realtime pipeline (happy path)

| ID | Behavior | Red |
|----|----------|-----|
| 4.1 | Publish `item.locked` → Redis message → WS emits to item room | Integration test or manual checklist |
| 4.2 | Client joins rooms before acquire | E2E or component test |
| 4.3 | Client handler updates “locked by” state on `item.locked` / `item.lock.denied` | |

| ID | Task |
|----|------|
| 4.4 | Remove or deprecate `buildWsEventPublisher` duplicate path |
| 4.5 | WS join handlers: reject `storeId` ≠ `authContext.storeId` |

---

### Phase 5 — Client edit lifecycle (happy path)

| ID | Step |
|----|------|
| 5.1 | On edit page mount: connect WS, `joinStoreRoom`, `joinItemRoom` |
| 5.2 | Call acquire action; store `lockToken` in component state |
| 5.3 | If `ok: false`, show read-only / “locked by …” |
| 5.4 | Interval: refresh lock (e.g. every 30s, ttl 60s) |
| 5.5 | On unmount / route leave: release lock |
| 5.6 | Subscribe to `item.unlocked` to clear lock UI for other users |

---

### Phase 6 — Category locks (reuse pattern)

| ID | Task |
|----|------|
| 6.1 | `LockKeys.category(storeId, categoryId)` |
| 6.2 | Extend `lockKeyRegex` / registry |
| 6.3 | `buildAcquireEditCategoryLockUsecase` (+ refresh, release) |
| 6.4 | Events in `EventRegistry` (or shared `entity.locked` pattern) |
| 6.5 | WS room `store:{storeId}:category:{categoryId}` |

---

### Phase 7 — Edge cases and hardening

Implement **after** Phases 1–5 happy path is green.

See [Edge cases catalog](#edge-cases-catalog) below. Map each edge case to a test ID in Phase 7.

| ID | Area |
|----|------|
| 7.1 | TTL expiry / no refresh → second user can acquire |
| 7.2 | `item.lock.expired` event (optional product decision) |
| 7.3 | Double release idempotent → `{ ok: false }`, no throw |
| 7.4 | Acquire after self-release → success |
| 7.5 | Refresh after TTL expired → `{ ok: false }` |
| 7.6 | Tab close without release → TTL heals |
| 7.7 | Same admin, two tabs, two tokens → second acquire denied (expected) |
| 7.8 | Cross-store: wrong store in WS join → denied / no join |
| 7.9 | Malformed lock key in Redis → `get` returns null, acquire succeeds |
| 7.10 | Invalid input: ttl bounds, empty entityId (already in use case tests) |
| 7.11 | Disconnect WS only — lock still held until TTL (document UX) |

---

## Edge cases catalog

### Lock ownership and tokens

| Case | Expected behavior | Test phase |
|------|-------------------|------------|
| Release with correct `lockToken` | `{ ok: true }`, key deleted | 1.3 |
| Release with wrong token | `{ ok: false }`, lock remains | 1.4 |
| Release when no lock | `{ ok: false }` | 7.3 |
| Refresh with correct token | TTL extended, `true` | 1.5 |
| Refresh with wrong token | `false`, lock unchanged | 1.6 |
| Refresh when lock expired | `false` | 7.5 |
| Two tokens same admin (two tabs) | Second acquire denied until first releases | 7.7 |

### Concurrency

| Case | Expected behavior | Test phase |
|------|-------------------|------------|
| Simultaneous acquire | Exactly one `ok: true` (Redis NX) | 1.2 (+ stress optional) |
| Release during other’s refresh | Lua atomicity — one wins cleanly | 7.x optional |

### Tenant isolation

| Case | Expected behavior | Test phase |
|------|-------------------|------------|
| Lock key includes `storeId` from auth | Cannot lock other store’s key via API | 2.x + 3.x |
| WS events only to matching item room | Other store sockets not in room | 4.1, 7.8 |
| Join item for another store | Rejected at WS layer | 4.5 |

### Lifecycle / UX

| Case | Expected behavior | Test phase |
|------|-------------------|------------|
| User closes tab without release | Lock expires after TTL | 7.6 |
| User navigates away | `release` called in cleanup | 5.5 |
| Lock held, user loses `items:update` | Refresh/release fail permission | 2.x |
| Display “locked by” without name | Show admin id; optional `lockedByName` later | backlog |

### Events

| Case | Expected behavior | Test phase |
|------|-------------------|------------|
| Acquire success | `item.locked` with `token`, `expiresAt` | 2.1 |
| Acquire denied | `item.lock.denied` | 2.2 |
| Release success | `item.unlocked` | 2.3 |
| Release denied | `item.unlock.denied` | 2.3 |
| TTL expiry notification | `item.lock.expired` (if product wants) | 7.2 |

### Invalid input (covered early)

| Case | Expected |
|------|----------|
| `ttlMs` < 1000 or > 10 min | `UseCaseValidationError` |
| Empty `entityId` | `UseCaseValidationError` |
| Missing auth | Auth error from `runUsecase` |

---

## Happy path (single narrative)

Use this as the **first E2E checklist** after Phase 5.

1. Admin A opens `/items/{id}/edit`.
2. Client connects WS, joins `store:{storeId}` and `store:{storeId}:item:{itemId}`.
3. Client calls **acquire** → `{ ok: true, lockToken, expiresAt }`.
4. Redis key `store:{storeId}:item:{itemId}` exists with JSON `{ lockToken, lockedBy, ... }`.
5. Redis pub/sub → ws-server → room receives `item.locked`.
6. Admin B opens same item → **acquire** → `{ ok: false, lockedBy: A }`; UI shows locked; B receives `item.lock.denied` if attempting acquire.
7. A edits; client **refresh** every N seconds with `lockToken`.
8. A leaves → **release** with `lockToken` → `{ ok: true }`; event `item.unlocked`.
9. B can acquire successfully.

---

## First failing test (Phase 1.3)

**File:** `src/infrastructure/redis/redis-lock-service.adapter.test.ts`

**Behavior:** After a successful `acquire`, `release(key, lockToken)` must return `{ ok: true }` and the lock key must be gone.

**Why it fails today:**

1. Lua compares `data["token"]` but stored JSON uses `lockToken`.
2. Adapter `release` returns a boolean, not `{ ok: boolean }`.

**Command:**

```bash
pnpm test -- redis-lock-service.adapter.test
```

---

## Progress tracker

Copy to PR description or issue checklist.

```
Phase 0  [x] Plan documented
Phase 1  [x] 1.1 acquire empty
         [ ] 1.2 acquire denied
         [x] 1.3 release correct token
         [ ] 1.4 release wrong token
         [ ] 1.5 refresh ok
         [ ] 1.6 refresh denied
         [x] 1.7–1.9 stray describe removed; port token-only release/refresh
         [ ] 1.10 helpers lockToken aligned
Phase 2  [ ] Use cases aligned
Phase 3  [ ] Server actions / API
Phase 4  [ ] WS pipeline
Phase 5  [ ] Edit page lifecycle
Phase 6  [ ] Categories
Phase 7  [ ] Edge cases
```

---

## References

- Architecture: [README.md](./README.md)
- Sequence: [FLOW.mermaid](./FLOW.mermaid)
- Item use cases: `src/application/item/usecase/*-lock.usecase.ts`
- Port: `lock-service.port.ts`
- Adapter: `src/infrastructure/redis/redis-lock-service.adapter.ts`
- WS: `ws-server/src/socket.ts`, `redis-event-subscriber.adapter.ts`
