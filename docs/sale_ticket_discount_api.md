# Backend: Sale ticket – Apply discount (PUT)

The frontend applies a discount to a sale ticket via this endpoint. Use this spec so the API matches what the app sends and returns.

---

## 1. Endpoint

**PUT** `/sales/:id/discount`

Example: `PUT http://127.0.0.1:8081/sales/42/discount`

---

## 2. Request body

JSON body:

| Field          | Type   | Required | Description |
|----------------|--------|----------|-------------|
| `discount_type`  | string | Yes      | `"amount"` or `"percent"`. **amount** = fixed value to subtract; **percent** = percentage of ticket subtotal. |
| `discount_value` | number | Yes      | For `amount`: the value to subtract. For `percent`: e.g. `10` means 10%. |

Example (fixed amount):

```json
{
  "discount_type": "amount",
  "discount_value": 5000
}
```

Example (percent):

```json
{
  "discount_type": "percent",
  "discount_value": 10
}
```

---

## 3. Response

- **Success:** 200 (or 204). No body required; frontend will refetch the ticket.
- **Error:** 4xx/5xx with an appropriate message.

---

## 4. Ticket / receipt shape (for GET ticket or open ticket)

When the frontend fetches the sale (e.g. open ticket or get ticket), the **receipt** object should include discount fields so the UI can show them:

| Field           | Type   | Description |
|-----------------|--------|-------------|
| `total_amount`  | number | Subtotal before discount (sum of line items). |
| `discount_type` | string | Optional. `"amount"` or `"percent"`. |
| `discount_value`| number | Discount applied (fixed amount or stored percent, depending on backend). |
| `final_amount`  | number | `total_amount - discount` (for amount) or computed when percent. |

So the sale ticket screen can show: **Subtotal** = `total_amount`, **Discount** = `-discount_value`, **Total payable** = `final_amount`.

---

## 5. Summary for the AI

- **PUT /sales/:id/discount** with body `{ "discount_type": "amount" | "percent", "discount_value": number }`.
- **amount:** subtract `discount_value` from subtotal to get `final_amount`.
- **percent:** apply `discount_value` % to subtotal, then set `final_amount` and store `discount_value` (and optionally `discount_type`) on the receipt.
- When returning the ticket/receipt, include `total_amount`, `discount_value`, `final_amount` (and optionally `discount_type`) so the frontend can display the discount breakdown.
