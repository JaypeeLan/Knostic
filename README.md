# Knostic Tiny Inventory

A full-stack inventory management system. Tracks stores and the products they carry, with filtering, pagination, and aggregated store-level metrics.

---

## Quick Start (Docker)

```bash
git clone <repo>
cd Knostic
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web app | http://localhost:3000 |
| REST API | http://localhost:3001/api |

> **Seed data** is loaded automatically on first boot (3 stores, 35 products across 7 categories, including low-stock and out-of-stock items).

---

## Local Dev (without Docker)

The backend and frontend run on **different ports** and don't conflict.

```bash
# Terminal 1 — API server on :3001
cd server && npm install && npm run seed && npm run dev

# Terminal 2 — Vite dev server on :3000 (proxies /api → :3001)
cd web && npm install && npm run dev
```

Open **http://localhost:3000**. The Vite dev server proxies all `/api/*` requests to `localhost:3001` automatically (see `web/vite.config.ts`), so there's no CORS configuration needed during development.

---

## Running Tests

```bash
cd server && npm test
```

23 integration tests covering stores CRUD, products CRUD, filtering, pagination, sorting, the aggregation endpoint, validation errors, and FK cascade delete. Tests run against a real in-memory SQLite database.

**Server Test runner:** Node.js native `node:test` (built into Node 18+) executed via `tsx`. This avoids any dependency conflicts with native bindings.

### Frontend Tests (Web)

```bash
cd web && npm test
```

Frontend unit and component tests are powered by **Vitest** and **React Testing Library**. Versioning issues between Vite and Vitest have been resolved (Vite 7+), allowing for a seamless testing experience in the frontend.

---

## API Sketch

```
GET    /api/stores                  List all stores
POST   /api/stores                  Create a store
GET    /api/stores/:id              Get store by ID
PUT    /api/stores/:id              Update store
DELETE /api/stores/:id              Delete store (cascades to products)
GET    /api/stores/:id/summary      Aggregated metrics (value, low-stock, by-category)

GET    /api/products                List products — filter + paginate
POST   /api/products                Create a product
GET    /api/products/:id            Get product by ID
PUT    /api/products/:id            Update product
DELETE /api/products/:id            Delete product
GET    /api/products/categories     Distinct category list

# Filtering & pagination (GET /api/products)
?storeId=1&category=Electronics&minPrice=50&maxPrice=500
&minStock=0&maxStock=10&search=laptop
&sort=price&order=asc&page=1&limit=20
```

---

## Decisions & Trade-offs

**SQLite over Postgres**
Zero infra overhead — no separate DB container, no connection strings to configure. The file is persisted via a named Docker volume. WAL mode enables concurrent reads without blocking writes. Enforcing `PRAGMA foreign_keys = ON` at the DB level means cascade deletes are guaranteed at the persistence layer, not just the application layer. Swapping to Postgres would be a config-level change (replace `better-sqlite3` with `pg`; query syntax is largely compatible).

**Express + TypeScript with plain SQL (no ORM)**
Keeping the data layer as `better-sqlite3` prepared statements keeps things transparent, fast, and avoids ORM magic. All query parameters are properly bound (no SQL injection risk). Zod validates inputs at the route level before they reach the DB.

**Vite + React (local state, no global store)**
The app is simple enough that `useState`/`useEffect` per page is sufficient. Adding Redux or Zustand would be premature here.

**Plain CSS custom properties (no Tailwind)**
A single `globals.css` design token file keeps the bundle tiny and avoids purge/JIT configuration. The dark premium theme is composed entirely from CSS variables that are easy to override.

**nginx as the static server for web**
The nginx container also reverse-proxies `/api` to the backend container, so there are no CORS issues in the Docker setup. In dev, Vite's built-in proxy serves the same role.

---

## Production Considerations

For a production deployment, the following would be addressed:

- **Request logging** — add `morgan` (or a structured logger like `pino`) for access logs
- **Rate limiting** — add `express-rate-limit` to protect write endpoints from abuse
- **Graceful shutdown** — listen for `SIGTERM`/`SIGINT` and close the DB connection before exiting
- **Environment config validation** — validate required env vars at startup with Zod (fail fast rather than runtime errors)
- **SQLite write concurrency** — SQLite is single-writer; for high write throughput, migrate to Postgres + a connection pool (e.g. `pg` + `pgBouncer`). WAL mode already maximises read concurrency for the current setup.
- **HTTPS / reverse proxy** — put the app behind a TLS-terminating load balancer (nginx/Caddy/ALB) in production; the nginx container here is already a good foundation
- **Structured error tracking** — integrate Sentry or a similar service for production error visibility

---

## Testing Approach

Integration tests live in `server/tests/api.test.ts` and run with the Node.js native `node:test` runner via `tsx`. The tests set `DB_PATH=':memory:'` before importing the app, so each test run gets a fresh isolated SQLite instance — no test database to clean up, no file system side-effects.

**Coverage:**
- Stores CRUD (create, read, update, delete)
- Products CRUD (create, read, update, delete)
- Input validation (missing fields, negative price, unknown foreign key)
- Filtering by category, store, price range
- Sorting (price ascending)
- Offset pagination (page/limit)
- `GET /stores/:id/summary` aggregation (total value, low-stock count, category breakdown)
- FK cascade: deleting a store removes its products

**What isn't covered:** Frontend UI behaviour. In a real CI pipeline this would be addressed with Playwright end-to-end tests covering the list → detail → create/edit user flow.

---

## If I Had More Time

- **End-to-end tests** — Playwright tests for the core user flows (browse stores → view summary → filter & paginate → create/edit product)
- **Optimistic UI + React Query** — replace `useEffect` fetch logic with React Query for caching, background re-fetching, and mutation optimism — significant UX and DX improvement
- **Auth & multi-tenancy** — a simple JWT layer and store ownership per user, so each reviewer can have a private namespace without affecting shared seed data
