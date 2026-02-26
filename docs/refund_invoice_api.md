# Refund Invoice – API usage

The **Refund Invoice** feature lets users search for an invoice by number (ticket number or sale ID) and refund the entire sale. Refunding the whole invoice keeps analytics correct when the sale had discounts.

---

## 1. Search by invoice number

The frontend finds invoices by calling the sales history endpoint with a `search` parameter. The backend should match `search` against **ticket number** and/or **sale id** so that users can type either.

### Request

**GET** `/sales/history?page=1&limit=50&search=INVOICE_OR_TICKET_NUMBER`

Example:

```
GET http://127.0.0.1:8081/sales/history?page=1&limit=50&search=1042
```

### Query parameters

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `page`    | number | Page number (1-based). |
| `limit`   | number | Page size (e.g. 50). |
| `search`  | string | Search term: **invoice number** (ticket_number) or **sale id**. Backend should match this against `ticket_number` and/or `id`. |

### Response

Same as the existing sales history response:

- `data`: array of sale objects (id, ticket_number, date, customer_name, payment_type, discount_value, final_amount, etc.).
- `meta`: { current_page, per_page, total_items, total_pages }.

The frontend filters the list to rows where `ticket_number` or `id` equals or contains the search term, but the backend is encouraged to do this filtering so that only matching invoices are returned.

---

## 2. Get sale detail (optional)

To show full invoice details before refund, the app can load a single sale:

**GET** `/sales/:id`

Example: `GET http://127.0.0.1:8081/sales/42`

Response: `{ data: { receipt: {...}, items: [...] } }` (same shape as your existing sale detail).

---

## 3. Refund invoice (full sale)

Refunding an invoice reverses the whole sale so that analytics (including discounts) are correct.

### Request

**POST** `/sales/:id/refund`

Example:

```
POST http://127.0.0.1:8081/sales/42/refund
Content-Type: application/json
```

No body required. Optional: you can accept a JSON body later for partial refunds or reason (e.g. `{ "reason": "customer request" }`).

### Backend behavior

1. Validate that the sale exists and is in a refundable state (e.g. not already refunded).
2. Reverse the sale:
   - Restore stock for all line items (increase inventory).
   - Reverse payment (e.g. reduce customer balance for loan, or record cash refund).
   - Mark the sale as refunded (e.g. `status = 'refunded'` or add a `refunded_at` field).
3. Update analytics so that:
   - Revenue and totals are reduced by the **final_amount** (after discount).
   - Discounts given are reduced by this sale’s **discount_value** so reports stay correct.

### Response

- **Success:** `200` or `204`. No body required.
- **Error:** `4xx` or `5xx` with a message. The frontend shows the response body or status text to the user.

---

## 4. Refund history (admin)

Admins need to see **which invoice was refunded** and **who refunded it**. The frontend calls:

**GET** `/sales/refunds?page=1&limit=20&search=...`

### Query parameters

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `page`    | number | Page number (1-based). |
| `limit`   | number | Page size (e.g. 20). |
| `search`  | string | Optional. Filter by ticket number, sale id, customer name, or refunded_by. |

### Response

```json
{
  "data": [
    {
      "id": 1,
      "sale_id": 42,
      "ticket_number": 1042,
      "refunded_at": "2025-02-23T14:30:00Z",
      "refunded_by": "Admin User",
      "refunded_by_id": 2,
      "customer_name": "John Doe",
      "final_amount": 25000,
      "discount_value": 2000
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total_items": 5,
    "total_pages": 1
  }
}
```

When you **POST /sales/:id/refund**, the backend should create or update a refund record (e.g. in a `refunds` table or by marking the sale as refunded and storing `refunded_at`, `refunded_by_user_id`) so that **GET /sales/refunds** can return this list.

---

## 5. Summary for the backend

| Action              | Method | Endpoint                  | Purpose |
|---------------------|--------|---------------------------|--------|
| Search by invoice   | GET    | `/sales/history?search=…` | Return sales where ticket_number or id matches the search term. |
| Get sale detail     | GET    | `/sales/:id`              | Return one sale with receipt and items. |
| Refund full invoice | POST   | `/sales/:id/refund`       | Reverse the sale; store who/when; update stock, payments, and analytics. |
| Refund history      | GET    | `/sales/refunds?page=&limit=&search=` | List refunded invoices with refunded_at and refunded_by for admin. |

Implementing these endpoints allows the Refund Invoice page to search by invoice number and refund invoices, and the Refund History page to show which invoice was refunded and who refunded it, so that analytics remain correct for discounted sales.
