# Define Item API – Backend Update

This document describes the API changes required so the **Define Item** (create/update product) flow supports **Company** and **Category**. Both fields are **optional** (nullable). The UI uses **type-ahead inputs** (user types, sees up to **5 suggestions**, can select one or leave empty). Category also has an **“Add category”** action (POST to create a new category).

---

## 1. Item payload: new fields

When creating or updating an item, the frontend sends:

| Field          | Type            | Required | Description                              |
|----------------|-----------------|----------|------------------------------------------|
| `company_id`   | `number \| null` | No       | ID of the company this product is from.  |
| `category_id`  | `number \| null` | No       | ID of the product category.              |

- **Create item:** `POST /items` body may include `company_id` and/or `category_id` (or omit them; treat as `null`).
- **Update item:** `PUT /items/:id` body may include `company_id` and/or `category_id` (or omit; keep existing or set null as per your rules).

---

## 2. Item response: return the same fields

For:

- `GET /items/barcode/:barcode`
- `POST /items` (response body)
- `PUT /items/:id` (response body)

include in the item JSON:

- `company_id`: number or null  
- `category_id`: number or null  

So the UI can pre-fill the Company and Category inputs when editing or after create/update.

---

## 3. Product categories

### 3.1 List categories (for type-ahead, max 5 suggestions)

The UI shows up to **5** category suggestions based on what the user types. The frontend filters the full list locally, so the backend just returns all categories (or a reasonable page).

- **Endpoint:** `GET /items/categories`
- **Response (one of):**
  - `{ "data": [ { "id": number, "name": string }, ... ] }`
  - or root array: `[ { "id": number, "name": string }, ... ]`

The frontend uses this list for type-ahead; item create/update still use `category_id` on the item.

### 3.2 Create category (“Add category” + button)

When the user clicks **+** next to the category input and submits a new name, the frontend calls:

- **Endpoint:** `POST /items/categories`
- **Body:** `{ "name": string }` (non-empty, frontend may trim)
- **Response:** the created category so the UI can select it immediately. Accept either:
  - `{ "id": number, "name": string }`
  - or `{ "data": { "id": number, "name": string } }`

### 3.3 Delete category (Categories settings page)

The **Categories (items)** page (`/categories-items`) lets users delete existing product categories. The frontend calls:

- **Endpoint:** `DELETE /items/categories/:id`
- **URL:** `id` is the numeric category ID.
- **Response:** success with `2xx` (e.g. `204 No Content` or `200 OK`). Non‑success (e.g. `404`, `409` if in use) will be treated as failure and the UI will not remove the category from the list until a successful call.

---

## 4. Companies

Company options come from the **existing** companies API (e.g. `GET /companies`). The frontend fetches a list and filters by name for type-ahead (max 5 suggestions). No new company endpoints are required; only **item** payloads and responses need `company_id` and `category_id` as above.

---

## 5. Summary checklist

- [ ] **Items table (or equivalent):** add nullable columns for `company_id` and `category_id`.
- [ ] **POST /items:** accept optional `company_id`, `category_id` in body; store or set null.
- [ ] **PUT /items/:id:** accept optional `company_id`, `category_id` in body; update or set null.
- [ ] **GET /items/barcode/:barcode** and item create/update responses: include `company_id` and `category_id` (number or null).
- [ ] **GET /items/categories:** return list of `{ id, name }` (array or `{ data: [...] }`).
- [ ] **POST /items/categories:** accept `{ "name": string }`, create category, return `{ id, name }` or `{ data: { id, name } }`.
- [ ] **DELETE /items/categories/:id:** delete the product category; return 2xx on success so the Categories (items) page can refresh the list.

Once these are in place, the Define Item UI will work with company and category (type-ahead + add category + category settings page to delete categories) without further frontend changes.
