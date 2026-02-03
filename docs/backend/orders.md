# Orders API

Order management endpoints for handling business orders and transactions.

## Base Path

```
/api/orders
```

---

## Endpoints

### 1. List Orders

Get a paginated list of orders.

**Endpoint:** `GET /api/orders`

**Authentication:** Required

**Note:** Users see only their own orders. Admins can see all orders.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 100) |
| `status` | string | - | Filter by status |
| `startDate` | string | - | Filter orders from date (ISO 8601) |
| `endDate` | string | - | Filter orders until date (ISO 8601) |
| `sortBy` | string | createdAt | Sort field |
| `sortOrder` | string | desc | Sort direction (asc, desc) |

#### Example Request

```bash
curl "http://localhost:3000/api/orders?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer <access_token>"
```

#### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "ord_123456789",
      "orderNumber": "ORD-2024-0001",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "customerName": "John Doe",
      "customerEmail": "customer@example.com",
      "status": "pending",
      "items": [
        {
          "id": "item_001",
          "name": "Product A",
          "quantity": 2,
          "price": 29.99,
          "total": 59.98
        }
      ],
      "subtotal": 59.98,
      "tax": 5.40,
      "total": 65.38,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

---

### 2. Get Order by ID

Get details of a specific order.

**Endpoint:** `GET /api/orders/:id`

**Authentication:** Required

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Order ID |

#### Example Request

```bash
curl http://localhost:3000/api/orders/ord_123456789 \
  -H "Authorization: Bearer <access_token>"
```

#### Success Response (200 OK)

```json
{
  "id": "ord_123456789",
  "orderNumber": "ORD-2024-0001",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "customerName": "John Doe",
  "customerEmail": "customer@example.com",
  "customerPhone": "+1234567890",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "status": "pending",
  "items": [
    {
      "id": "item_001",
      "productId": "prod_abc123",
      "name": "Product A",
      "description": "Product description",
      "quantity": 2,
      "price": 29.99,
      "total": 59.98
    }
  ],
  "subtotal": 59.98,
  "discount": 0,
  "tax": 5.40,
  "shipping": 5.00,
  "total": 70.38,
  "notes": "Please handle with care",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 404 | Order not found |
| 403 | Access denied (not your order) |

---

### 3. Create Order

Create a new order.

**Endpoint:** `POST /api/orders`

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customerName` | string | Yes | Customer full name |
| `customerEmail` | string | Yes | Customer email |
| `customerPhone` | string | No | Customer phone number |
| `shippingAddress` | object | Yes | Shipping address |
| `billingAddress` | object | No | Billing address (defaults to shipping) |
| `items` | array | Yes | Order items |
| `notes` | string | No | Order notes |

#### Address Object

| Field | Type | Required |
|-------|------|----------|
| `street` | string | Yes |
| `city` | string | Yes |
| `state` | string | Yes |
| `zipCode` | string | Yes |
| `country` | string | Yes |

#### Item Object

| Field | Type | Required |
|-------|------|----------|
| `productId` | string | Yes |
| `name` | string | Yes |
| `quantity` | number | Yes |
| `price` | number | Yes |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "customer@example.com",
    "customerPhone": "+1234567890",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "items": [
      {
        "productId": "prod_abc123",
        "name": "Product A",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "notes": "Please handle with care"
  }'
```

#### Success Response (201 Created)

```json
{
  "id": "ord_123456789",
  "orderNumber": "ORD-2024-0001",
  "status": "pending",
  "total": 70.38,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 | Validation error |

---

### 4. Update Order

Update an existing order.

**Endpoint:** `PATCH /api/orders/:id`

**Authentication:** Required

**Note:** Can only update orders with status "pending" or "processing"

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Order ID |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customerName` | string | No | Customer name |
| `customerEmail` | string | No | Customer email |
| `customerPhone` | string | No | Customer phone |
| `shippingAddress` | object | No | Shipping address |
| `items` | array | No | Order items |
| `notes` | string | No | Order notes |

#### Example Request

```bash
curl -X PATCH http://localhost:3000/api/orders/ord_123456789 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "notes": "Updated delivery instructions"
  }'
```

#### Success Response (200 OK)

```json
{
  "id": "ord_123456789",
  "orderNumber": "ORD-2024-0001",
  "status": "pending",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 | Cannot modify completed/cancelled order |
| 404 | Order not found |

---

### 5. Update Order Status

Change the status of an order.

**Endpoint:** `PATCH /api/orders/:id/status`

**Authentication:** Required (Admin only)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Order ID |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | Yes | New order status |
| `reason` | string | No | Reason for status change |

#### Valid Status Transitions

```
pending → processing → shipped → delivered
pending → cancelled
processing → cancelled
```

#### Example Request

```bash
curl -X PATCH http://localhost:3000/api/orders/ord_123456789/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_access_token>" \
  -d '{
    "status": "processing"
  }'
```

#### Success Response (200 OK)

```json
{
  "id": "ord_123456789",
  "status": "processing",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

### 6. Delete Order

Delete an order (soft delete).

**Endpoint:** `DELETE /api/orders/:id`

**Authentication:** Required (Admin only)

**Note:** Only pending orders can be deleted

#### Example Request

```bash
curl -X DELETE http://localhost:3000/api/orders/ord_123456789 \
  -H "Authorization: Bearer <admin_access_token>"
```

#### Success Response (200 OK)

```json
{
  "message": "Order deleted successfully"
}
```

---

## Order Statuses

| Status | Description |
|--------|-------------|
| `pending` | Order created, awaiting processing |
| `processing` | Order is being prepared |
| `shipped` | Order has been shipped |
| `delivered` | Order delivered to customer |
| `cancelled` | Order was cancelled |

## Status Flow Diagram

```
                    ┌──────────┐
                    │ pending  │
                    └────┬─────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             │
    ┌──────────┐   ┌──────────┐        │
    │cancelled │   │processing│        │
    └──────────┘   └────┬─────┘        │
                        │              │
              ┌─────────┼──────────────┘
              │         │
              ▼         ▼
       ┌──────────┐  ┌──────────┐
       │cancelled │  │ shipped  │
       └──────────┘  └────┬─────┘
                          │
                          ▼
                   ┌──────────┐
                   │delivered │
                   └──────────┘
```

## Webhooks (Coming Soon)

Subscribe to order events:
- `order.created`
- `order.updated`
- `order.status_changed`
- `order.cancelled`
