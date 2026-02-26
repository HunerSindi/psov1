# Backend: Per-item discount on sale ticket (line item)

The frontend shows and edits **discount type** and **discount value** per line item on the sale ticket. The API must support returning and updating `discount_type` and `discount_value` per item.

---

## 1. Line item shape (when returning sale / ticket)

When the backend returns a sale (e.g. open ticket, get ticket), each object in `items[]` should include:

| Field                | Type   | Description |
|----------------------|--------|-------------|
| `id`                 | number | Line item ID (used for PUT updates). |
| `item_id`            | number | Product/item ID. |
| `item_name`          | string | Product name. |
| `unit_type`          | string | Unit (single, packet, etc.). |
| `cost_price`         | number | Cost. |
| `price`              | number | Unit price. |
| `quantity`           | number | Quantity. |
| `discount_type`      | string | **Per-item discount type:** `"percent"` or `"amount"`. Optional; default `"amount"` if not set. |
| `discount_value`     | number | **Per-item discount value:** percentage (e.g. 10) or fixed amount. Default 0 if not set. |
| `discount_start_date`| string | Optional; start date for discount validity (e.g. `"2025-02-01"`). |
| `discount_end_date`  | string | Optional; end date for discount validity (e.g. `"2025-02-10"`). |
| `subtotal`           | number | Line total **after** discount (e.g. for percent: `price * qty * (1 - discount_value/100)`; for amount: `price * qty - discount_value`). |

---

## 2. Update line item (quantity or discount)

**PUT** `/sales/items/:itemId`

The frontend sends **partial** updates: only the fields that change.

- To change **quantity:**  
  `{ "quantity": 12 }`
- To change **per-item discount (type + value):**  
  `{ "discount_type": "percent", "discount_value": 10 }`  
  or  
  `{ "discount_type": "amount", "discount_value": 500 }`

The backend should apply only the sent fields and recalculate that line’s `subtotal` and the ticket’s `total_amount` / `final_amount`.

Example (set line item 5 to 10% discount):

```
PUT /sales/items/5
Content-Type: application/json

{ "discount_type": "percent", "discount_value": 10 }
```

Example (set line item 5 to fixed discount 500):

```
PUT /sales/items/5
Content-Type: application/json

{ "discount_type": "amount", "discount_value": 500 }
```

---

## 3. Summary for the AI

- **Response:** Each item in `items[]` should have `discount_type` (`"percent"` | `"amount"`), `discount_value` (number), and optionally `discount_start_date` / `discount_end_date`. `subtotal` is the line total after applying the discount.
- **PUT /sales/items/:itemId:** Accept optional `quantity`, `discount_type`, and/or `discount_value`; update only provided fields; recompute line subtotal and ticket totals.
