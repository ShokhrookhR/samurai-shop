---
name: add-resource
description: Scaffold a brand-new REST resource (Mongoose model, repository, domain service, input/view models, router) following this project's layered architecture. Use when the user asks to add a new entity/resource/module to the API (e.g. "add an orders resource", "add a reviews endpoint group", "create a new collection for X").
---

# Add a new REST resource

This project (`samurai-shop`) uses a fixed layering for every resource:

```
routes/<name>Router.ts        Express Router, HTTP concerns only
  -> domain/<name>Service.ts  business logic, calls repository
    -> repositories/<name>Repository.ts  data access
      -> repositories/db.ts   Mongoose schema/model (or a native collection)
```

Types live in `src/types/<name>.ts`. Request/response shapes live in
`src/models/<name>InputModel.ts` and `src/models/<name>ViewModel.ts` (view
models are usually generic, see `IProductViewModel`). Every folder
(`routes`, `domain`, `repositories`, `models`, `types`, `middlewares`,
`constants`) re-exports its files through a barrel `index.ts` — always add
the new file there, and import from the barrel (`../domain`, `../models`,
etc.), not the concrete file, from outside the folder.

Use relative imports (`../domain`, `../repositories/db`), matching existing
code — the `~/*` path alias in `tsconfig.json` is configured but not
actually used anywhere yet, so don't introduce it in isolation.

## Steps

Given a resource name, e.g. `order` (singular) / `orders` (route path):

1. **Type** — `src/types/order.ts`:
   ```ts
   export interface IOrder {
     uid?: string;
     // fields...
   }
   ```
   Add `export * from './order';` to `src/types/index.ts`.

2. **Mongoose model** — add a schema + model to `src/repositories/db.ts`
   next to `productsSchema`/`ProductModel`, e.g.:
   ```ts
   const ordersSchema = new mongoose.Schema({
       // fields, mirroring the IOrder shape
   });
   export const OrderModel = mongoose.model('Orders', ordersSchema);
   ```
   Only use a raw `client.db(...).collection(...)` (like
   `feedbackCollection`) if the user explicitly wants to bypass Mongoose —
   Mongoose is the default going forward.

3. **Input/view models** — `src/models/orderInputModel.ts` for query/body
   shapes (see `IProductInputModel`), and reuse or extend
   `IProductViewModel<T>`-style generic in `src/models/productViewModel.ts`
   for paginated list responses. Export from `src/models/index.ts`.

4. **Repository** — `src/repositories/orderRepository.ts`, class
   `OrderRepository`, constructor takes no args and assigns
   `this.model = OrderModel`. Methods return domain types (`IOrder`, never
   raw Mongoose documents) — always map through a private `mapToOrder`
   method, using `.lean()` on reads. Validate any id param with
   `ObjectId.isValid(...)` before querying. Follow the pagination pattern
   in `ProductRepository.findProducts` (DEFAULT_PAGE_SIZE/MAX_PAGE_SIZE,
   regex-escaped text filters, `.skip()/.limit()`, `countDocuments`).
   Add `export * from './orderRepository';` to `src/repositories/index.ts`.

5. **Domain service** — `src/domain/orderService.ts`, class `OrderService`
   that constructs its own repository in the constructor
   (`this.repository = new OrderRepository()`) and exposes thin
   pass-through async methods with the same names/signatures as the
   repository (see `ProductService`). Business rules / cross-repository
   coordination go here, not in the router or repository.
   Add `export * from './orderService';` to `src/domain/index.ts`.

6. **Router** — `src/routes/orderRouter.ts`, exporting a factory
   `getOrderRoutes()` that builds a `Router()`, instantiates the service
   once, and wires handlers:
   - `GET /` — list with query filters, `res.send(result)`.
   - `GET /:uid` — `res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)` if not found.
   - `POST /` — put `authMiddleware` before the handler if the action
     requires a logged-in user (`req.user!._id`), then
     `inputValidationMiddleware` after any `checkSchema`/`body(...)`
     validators, then the async handler. Return
     `HTTP_STATUSES.BAD_REQUEST_400` if creation fails,
     `HTTP_STATUSES.CREATED_201` (or plain `res.send`, matching sibling
     routers) on success.
   Use `HTTP_STATUSES` from `../constants` instead of magic numbers for
   anything beyond the most common 200/400/404 (existing routers are
   inconsistent here — prefer the enum for new code).
   Add `export * from './orderRouter';` to `src/routes/index.ts`.

7. **Wire into the app** — in `src/index.ts`, import `getOrderRoutes` from
   `./routes` and add `app.use('/orders', getOrderRoutes());` next to the
   other `app.use(...)` calls.

## After scaffolding

- Run `pnpm build` (or `npx tsc --noEmit`) to confirm the new files type-check.
- Don't add tests, error-handling, or validation beyond what sibling
  resources (`product`, `club`, `feedback`) already do unless asked —
  match the existing level of rigor rather than gold-plating the new
  resource.
