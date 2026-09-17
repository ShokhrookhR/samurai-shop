---
name: add-endpoint
description: Add a new HTTP endpoint (controller method + route) to an existing resource in this project, with the right validation/auth middleware order and response conventions. Use when the user asks to add a single new route/endpoint/method to an existing resource (e.g. "add a DELETE /products/:uid endpoint", "add a PATCH route for clubs").
---

# Add an endpoint to an existing resource

Each resource has three thin, separate pieces:

- `src/routes/<name>Router.ts` — a factory `getXRoutes()` that builds a
  `Router()`, instantiates the resource's `*Controller` once, and chains
  `.get/.post/.patch/.delete(path, ...middleware, controller.method)`.
  It contains **no handler logic** — just path + middleware + which
  controller method to call.
- `src/controllers/<name>Controller.ts` — a class that instantiates its
  `*Service` in the constructor and exposes one **arrow-function class
  property per endpoint** (e.g. `getProductByUId = async (req, res) => {...}`).
  Arrow properties are required, not optional style — a regular method
  loses its `this` binding when passed as `controller.method` directly to
  Express.
- `src/domain/<name>Service.ts` — business logic / pass-through to the repository.

See `src/routes/productRouter.ts` + `src/controllers/productController.ts`
for the reference pair.

## Adding the endpoint

1. Add a new arrow-function property to the resource's `*Controller`
   class, next to its siblings, typed like:
   ```ts
   deleteProduct = async (req: Request<{uid: string}>, res: Response) => {
       const deleted = await this.service.deleteProduct(req.params.uid);
       if (!deleted) {
           res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
           return;
       }
       res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
   };
   ```
   Type the Express `Request` generic explicitly
   (`Request<ParamsType, {}, BodyType, QueryType>`), matching the existing
   controller methods. Only fall back to an untyped `Request` (casting
   individual fields with `as`) if a strict generic conflicts with
   Express's overload resolution when chained after `checkSchema`/
   `inputValidationMiddleware` in the same route (this happens with a
   custom `Query` type that doesn't extend `ParsedQs` — see
   `AuthController.confirmEmail` for the workaround).

2. Wire the route in the resource's `*Router.ts`:
   ```ts
   router.post(
       '/path',
       authMiddleware,                 // only if the route requires a logged-in user
       checkSchema({ ... }),           // for any endpoint accepting body/query input
       inputValidationMiddleware,      // must come right after validators
       productController.deleteProduct
   );
   ```
   - `authMiddleware` (from `../middlewares`) populates `req.user` from the
     bearer token; a controller method after it can read `req.user!._id`.
     Skip it for public endpoints.
   - `inputValidationMiddleware` (from `../middlewares`) turns
     express-validator errors into a `400` with `{errorsMessages: [...]}` —
     it must be the last middleware before the controller method whenever
     any `checkSchema` validators are used. Every write endpoint in this
     project validates its input — don't add one that skips this.

## Handler body conventions

- Call into the controller's already-instantiated `*Service` — never touch
  a repository or the database directly from a controller, and never put
  business logic in the router.
- Not-found: `res.sendStatus(HTTP_STATUSES.NOT_FOUND_404); return;`
- Bad input / failed operation: `res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400); return;`
- Success with a body: `res.send(result)` (add `.status(HTTP_STATUSES.CREATED_201)` before `.send` for creates, matching `feedbackController`/`authController`).
- Success with no body: `res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)`.
- Import `HTTP_STATUSES` from `../constants` — avoid bare numeric status codes in new code.

## If the operation needs new logic below the controller

1. Add/extend a method on the resource's `*Service` in `src/domain/` (it
   should just forward to the repository unless there's real business
   logic to add).
2. Add/extend the corresponding method on the `*Repository` in
   `src/repositories/`, following the id-validation (`ObjectId.isValid`),
   `.lean()`, and result-mapping (`mapToX`) patterns already used there.

Then call the new service method from the controller.

## After adding the endpoint

Run `pnpm build` (or `npx tsc --noEmit`) to confirm it type-checks. Don't
add tests or extra validation beyond what sibling endpoints on the same
resource already have unless asked.
