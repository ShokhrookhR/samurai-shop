---
name: add-resource
description: Scaffold a brand-new REST resource (Mongoose model, repository, domain service, controller, input/view models, router) following this project's layered architecture. Use when the user asks to add a new entity/resource/module to the API (e.g. "add an orders resource", "add a reviews endpoint group", "create a new collection for X").
---

# Add a new REST resource

This project (`samurai-shop`) uses a fixed layering for every resource:

```
routes/<name>Router.ts            wiring only: path + middleware -> controller method
  -> controllers/<name>Controller.ts  reads req/writes res, calls the service
    -> domain/<name>Service.ts    business logic, calls repository
      -> repositories/<name>Repository.ts  data access
        -> repositories/db.ts     Mongoose schema/model
```

Types live in `src/types/<name>.ts`. Request/response shapes live in
`src/models/<name>InputModel.ts` and `src/models/<name>ViewModel.ts` (view
models are usually generic, see `IProductViewModel`). Every folder
(`routes`, `controllers`, `domain`, `repositories`, `models`, `types`,
`middlewares`, `constants`, `infra`) re-exports its files through a barrel
`index.ts` — always add the new file there, and import from the barrel
(`../domain`, `../controllers`, `../models`, etc.), not the concrete file,
from outside the folder.

Use relative imports (`../domain`, `../repositories/db`), matching existing
code — there is no path alias configured or used in this project.

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
   Mongoose is the only persistence mechanism in this project — every
   resource goes through it, there is no raw MongoDB-driver collection to
   fall back to.

3. **Input/view models** — `src/models/orderInputModel.ts` for query/body
   shapes (see `IProductInputModel` for query filters and
   `IProductInputBodyModel` for a POST body), and reuse or extend the
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
   coordination go here, not in the controller or repository.
   Add `export * from './orderService';` to `src/domain/index.ts`.

6. **Controller** — `src/controllers/orderController.ts`, class
   `OrderController` that constructs its own service in the constructor
   (`this.service = new OrderService()`) and exposes one **arrow-function
   class property per endpoint** (not regular methods — arrow properties
   keep `this` bound when Express calls them directly as
   `orderController.getOrders`), e.g.:
   ```ts
   export class OrderController {
       constructor() {
           this.service = new OrderService();
       }
       private readonly service: OrderService;

       getOrders = async (req: Request<{}, {}, {}, IOrderInputModel>, res: Response) => {
           const result = await this.service.findOrders(req.query);
           res.send(result);
       };

       getOrderByUId = async (req: Request<{uid: string}>, res: Response) => {
           const found = await this.service.findOrderByUId(req.params.uid);
           if (!found) {
               res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
               return;
           }
           res.send(found);
       };

       createOrder = async (req: Request<{}, {}, IOrderInputBodyModel>, res: Response) => {
           const created = await this.service.createOrder(req.body, req.user!._id);
           if (!created) {
               res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
               return;
           }
           res.send(created);
       };
   }
   ```
   See `src/controllers/productController.ts` / `clubController.ts` for
   the exact pattern. Add `export * from './orderController';` to
   `src/controllers/index.ts`.

7. **Router** — `src/routes/orderRouter.ts`, exporting a factory
   `getOrderRoutes()` that builds a `Router()`, instantiates the
   controller once, and wires paths straight to controller methods — no
   inline handler logic in the router itself:
   ```ts
   export const getOrderRoutes = () => {
       const ordersRouter = Router();
       const orderController = new OrderController();

       ordersRouter
           .get('/', orderController.getOrders)
           .get('/:uid', orderController.getOrderByUId)
           .post(
               '/',
               authMiddleware,
               checkSchema({ /* ... */ }),
               inputValidationMiddleware,
               orderController.createOrder
           );
       return ordersRouter;
   };
   ```
   `authMiddleware` only if the endpoint requires a logged-in user;
   `checkSchema(...)` + `inputValidationMiddleware` for any endpoint that
   accepts a body/query the user controls — every resource in this project
   validates its write endpoints, don't skip it for a new one. Use
   `HTTP_STATUSES` from `../constants` instead of magic numbers.
   Add `export * from './orderRouter';` to `src/routes/index.ts`.

8. **Wire into the app** — in `src/index.ts`, import `getOrderRoutes` from
   `./routes` and add `app.use('/orders', getOrderRoutes());` next to the
   other `app.use(...)` calls.

## After scaffolding

- Run `pnpm build` (or `npx tsc --noEmit`) to confirm the new files type-check.
- Don't add tests, error-handling, or validation beyond what sibling
  resources (`product`, `club`, `feedback`) already do unless asked —
  match the existing level of rigor rather than gold-plating the new
  resource.
