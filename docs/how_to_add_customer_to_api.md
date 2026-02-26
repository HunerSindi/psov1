# Backend: Add `customer_id` filter to Sales History endpoint

Use this spec to update your **GET sales history** endpoint so the frontend can request sales for a specific customer by ID.

---

## 1. Endpoint

**GET** `/sales/history` (base URL e.g. `http://127.0.0.1:8081`)

Existing query parameters (keep them as-is):

- `page` (number)
- `limit` (number)
- `search` (string) — name, phone, ticket, etc.
- `payment_type` (string) — cash, loan, installment
- `min_amount`, `max_amount` (string)
- `start_date`, `end_date` (string)

---

## 2. New query parameter: `customer_id`

| Parameter   | Type   | Required | Description |
|------------|--------|----------|-------------|
| `customer_id` | number (integer) | No | When present, return **only** sales/receipts where `customer_id` equals this value. When omitted, do not apply this filter (current behavior). |

- **Omitted or not sent:** Do not filter by customer; return sales as you do today (other filters like `search`, `payment_type`, etc. still apply).
- **Sent (e.g. `customer_id=5`):** Before applying pagination, filter the result set so that only rows with `customer_id = 5` are included. Pagination (`page`, `limit`) and `total_items` / `total_pages` must be computed **after** this filter (so totals and pages refer to that customer’s sales only).

---

## 3. Behavior

- Each sale/receipt row has a `customer_id` field (or equivalent in your DB). When `customer_id` is sent:
  - Include only rows where `customer_id` equals the given value.
  - Rows with `customer_id = null` (guest sales) must **not** be included when filtering by a numeric `customer_id`.
- Apply `customer_id` filter **together** with any existing filters (`search`, `payment_type`, dates, etc.). So the frontend can send both `customer_id=5` and `search=...` if needed; your backend should apply both.

---

## 4. Example request

```
GET /sales/history?page=1&limit=20&customer_id=5
```

- Return only sales where `customer_id = 5`.
- Response shape (JSON with `data` array and `meta` with `current_page`, `per_page`, `total_items`, `total_pages`) stays the same.

---

## 5. Response shape (unchanged)

No change to the response structure. Each item in `data` already has (or should have) at least:

- `id`, `ticket_number`, `date`, `status`, `payment_type`, `customer_id`, `customer_name`, `customer_phone`, amounts, etc.

Just ensure the **list** is filtered by `customer_id` when the query parameter is provided.

---

## 6. Summary for the AI

- **Endpoint:** GET `/sales/history`
- **New optional query param:** `customer_id` (integer).
- **When `customer_id` is present:** Filter the sales list to rows where `customer_id` equals that value; then apply pagination and other filters as usual.
- **When `customer_id` is absent:** No change; keep current behavior.
