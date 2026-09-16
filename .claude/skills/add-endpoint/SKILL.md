---
name: add-endpoint
description: Add a new HTTP endpoint (route handler) to an existing router in this project, with the right validation/auth middleware order and response conventions. Use when the user asks to add a single new route/endpoint/method to an existing resource (e.g. "add a DELETE /products/:uid endpoint", "add a PATCH route to clubRouter").
---

# Add an endpoint to an existing router

Routers live in `src/routes/*Router.ts` and are built with a factory
function (`getXRoutes()`) that creates a `Router()`, instantiates the
relevant `*Service` once, and chains `.get/.post/.patch/.delete(...)` calls
on it — see `src/routes/productRouter.ts` and `src/routes/authRouter.ts`.

## Handler middleware order

For a protected write endpoint, middleware order is always:

```ts
router.post(
    '/path',
    authMiddleware,                 // only if the route requires a logged-in user
    checkSchema({ ... }) /* or body('field').isX() */,
    inputValidationMiddleware,      // must come right after validators
    async (req: Request<Params, ResBody, ReqBody, Query>, res: Response) => {
        // handler
    }
);
```

- `authMiddleware` (from `../middlewares`) populates `req.user` from the
  bearer token; a handler after it can read `req.user!._id`. Skip it for
  public endpoints (see the auth router's `/login`, `/register`).
- `inputValidationMiddleware` (from `../middlewares`) turns
  express-validator errors into a `400` with `{errorsMessages: [...]}` —
  it must be the last middleware before the handler whenever any
  `checkSchema`/`body`/`query` validators are used.
- Type the Express `Request` generic explicitly
  (`Request<ParamsType, {}, BodyType, QueryType>`) rather than leaving it
  untyped, matching the existing handlers.

## Handler body conventions

- Call into the router's already-instantiated `*Service` — never touch a
  repository or the database directly from a router.
- Not-found: `res.sendStatus(HTTP_STATUSES.NOT_FOUND_404); return;`
- Bad input / failed operation: `res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400); return;`
- Success with a body: `res.send(result)` (add `.status(HTTP_STATUSES.CREATED_201)` before `.send` for creates, matching `feedbackRouter`/`authRouter`).
- Success with no body: `res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)`.
- Import `HTTP_STATUSES` from `../constants` — avoid bare numeric status codes in new code.

## If the operation needs new logic below the router

Don't put business logic in the router handler itself:
1. Add/extend a method on the resource's `*Service` in `src/domain/` (it
   should just forward to the repository unless there's real business
   logic to add).
2. Add/extend the corresponding method on the `*Repository` in
   `src/repositories/`, following the id-validation (`ObjectId.isValid`),
   `.lean()`, and result-mapping (`mapToX`) patterns already used there.

Then call the new service method from the router handler.

## After adding the endpoint

Run `pnpm build` (or `npx tsc --noEmit`) to confirm it type-checks. Don't
add tests or extra validation beyond what sibling endpoints in the same
router already have unless asked.
