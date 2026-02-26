# Backend: Add `is_lose` filter to Get Inventory endpoint

Use this spec to update your **current GET inventory/items** endpoint so the frontend can request only items that are sold at a loss.

---

## 1. Endpoint

**GET** `/items` (or whatever your current “list inventory items” route is)

Existing query parameters (keep them as-is):

- `search` (string)
- `page` (number)
- `page_size` (number)
- `sort_by` (string)

---

## 2. New query parameter: `is_lose`

| Parameter | Type   | Required | Values   | Description |
|-----------|--------|----------|----------|-------------|
| `is_lose` | string | No       | `"true"` or `"false"` | When `"true"`, return only **loss items**. When `"false"` or omitted, use current behavior (all items or no loss filter). |

- **Omitted or not sent:** Do not apply any loss filter; return items as you do today.
- **`is_lose=true`:** Return only items where the item is sold at a loss (see definition below).
- **`is_lose=false`:** Explicit “no loss filter” (same as omitting the param).

---

## 3. Definition of “loss item”

An item is considered a **loss** if **cost price is greater than at least one of its sell prices**:

- `cost_price > single_price`  
  **or**
- `cost_price > wholesale_price`  
  **or**
- `packet_cost_price > packet_price`

So:

- **When `is_lose=true`:** Filter the inventory list so that only rows satisfying at least one of the conditions above are returned. Pagination (`page`, `page_size`) and `total_count` must be applied **after** this filter (so `total_count` is the count of loss items, and pages are pages of loss items).
- **When `is_lose=false` or param missing:** Do not apply this filter; behavior stays as it is now.

---

## 4. Response shape (unchanged)

Response body should remain the same as your current GET inventory response, for example:

- `items`: array of item objects (each with at least `id`, `name`, `barcodes`, `unit_type`, `cost_price`, `single_price`, `wholesale_price`, `packet_price`, `current_quantity`, `alert_quantity`, `expiration_date`, etc.)
- `total_count`: total number of items **after** applying the loss filter (when `is_lose=true`, this is the total number of loss items).
- `page_size`: same as the requested `page_size`.

No new fields are required; only the filtering logic and `total_count` semantics change when `is_lose=true`.

---

## 5. Example requests

- All items (current behavior):  
  `GET /items?search=&page=1&page_size=20&sort_by=`

- Only loss items:  
  `GET /items?search=&page=1&page_size=20&sort_by=&is_lose=true`

- Explicit “no loss filter”:  
  `GET /items?search=&page=1&page_size=20&sort_by=&is_lose=false`

---

## 6. Summary for implementation

1. In your GET inventory handler, read the optional query parameter `is_lose` (`"true"` / `"false"`).
2. If `is_lose` is not present or is `"false"`, keep existing logic (no loss filter).
3. If `is_lose` is `"true"`:
   - After applying `search` and `sort_by`, filter the result set so that only items where  
     `cost_price > single_price OR cost_price > wholesale_price OR cost_price > packet_price`  
     are kept.
   - Apply pagination (`page`, `page_size`) on this filtered list.
   - Set `total_count` to the total number of items in this filtered list (before pagination).
4. Return the same response structure as today; only the set of items and `total_count` change when `is_lose=true`.

After implementing this, the frontend can call the same GET inventory endpoint with `is_lose=true` or `is_lose=false` and will receive the correct list and total count without any extra API.
