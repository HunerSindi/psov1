# Backend: Allow GET /customers/:id (single customer)

The frontend needs to **GET a single customer by ID** for the customer detail page (e.g. `/customers/9`). Right now the backend returns **405 Method Not Allowed** for `GET /customers/9` and only allows **PUT** on that path.

---

## 1. Endpoint

**GET** `/customers/:id`

Example: `GET http://127.0.0.1:8081/customers/9`

- **Current behaviour:** 405 Method Not Allowed (response header `Allow: PUT`).
- **Required:** Support **GET** so the frontend can fetch one customer by `id` to show name and details.

---

## 2. Response shape

Return JSON with the customer object, for example:

```json
{
  "data": {
    "id": 9,
    "name": "يحيى شنكالي",
    "name2": "",
    "phone": "0",
    "address": "",
    "balance": 0,
    "initial_balance": 0,
    "active": true
  }
}
```

- The frontend expects a top-level `data` field containing the customer (with at least `id`, `name`; optional `name2`, `phone`, `address`, `balance`, etc.).
- **Status:** 200 when the customer exists; 404 when no customer with that `id` exists.

---

## 3. Summary for the AI

- **Route:** `GET /customers/:id`
- **Action:** Add or enable a GET handler for this route (in addition to any existing PUT/DELETE).
- **Response:** `{ "data": { "id", "name", ... } }` with 200, or 404 if not found.
- This fixes the 405 error and allows the customer detail page to show the customer name and load ledger + sales history correctly.
