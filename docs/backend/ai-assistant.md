# AI Assistant API

AI-powered assistant endpoints for natural language queries and intelligent operations.

## Base Path

```
/api/ai
```

---

## Overview

The AI Assistant provides natural language interface to interact with SmartOps platform. Users can ask questions, get insights, and perform actions using conversational commands.

---

## Endpoints

### 1. Send Message

Send a message to the AI assistant and get a response.

**Endpoint:** `POST /api/ai/chat`

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | User's message or query |
| `conversationId` | string | No | ID to continue existing conversation |
| `context` | object | No | Additional context for the AI |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "message": "Show me all pending orders from last week"
  }'
```

#### Success Response (200 OK)

```json
{
  "id": "msg_abc123",
  "conversationId": "conv_xyz789",
  "response": "I found 15 pending orders from last week. Here's a summary:\n\n- Total value: $2,450.00\n- Average order value: $163.33\n- Oldest pending order: 5 days ago\n\nWould you like me to show the detailed list or help you process these orders?",
  "data": {
    "type": "orders_summary",
    "orders": [
      {
        "id": "ord_001",
        "orderNumber": "ORD-2024-0150",
        "total": 125.00,
        "status": "pending"
      }
    ],
    "summary": {
      "count": 15,
      "totalValue": 2450.00,
      "averageValue": 163.33
    }
  },
  "suggestedActions": [
    {
      "label": "View all orders",
      "action": "navigate",
      "params": { "path": "/orders?status=pending" }
    },
    {
      "label": "Process oldest order",
      "action": "process_order",
      "params": { "orderId": "ord_001" }
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Get Conversation History

Retrieve previous conversation messages.

**Endpoint:** `GET /api/ai/conversations/:id`

**Authentication:** Required

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Conversation ID |

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Number of messages to retrieve |
| `before` | string | - | Get messages before this message ID |

#### Example Request

```bash
curl "http://localhost:3000/api/ai/conversations/conv_xyz789?limit=20" \
  -H "Authorization: Bearer <access_token>"
```

#### Success Response (200 OK)

```json
{
  "id": "conv_xyz789",
  "messages": [
    {
      "id": "msg_001",
      "role": "user",
      "content": "Show me all pending orders",
      "createdAt": "2024-01-15T10:29:00.000Z"
    },
    {
      "id": "msg_002",
      "role": "assistant",
      "content": "I found 15 pending orders...",
      "data": { ... },
      "createdAt": "2024-01-15T10:29:05.000Z"
    }
  ],
  "createdAt": "2024-01-15T10:29:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 3. List Conversations

Get all conversations for the current user.

**Endpoint:** `GET /api/ai/conversations`

**Authentication:** Required

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |

#### Example Request

```bash
curl "http://localhost:3000/api/ai/conversations?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

#### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "conv_xyz789",
      "title": "Pending orders inquiry",
      "lastMessage": "I found 15 pending orders...",
      "messageCount": 5,
      "createdAt": "2024-01-15T10:29:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### 4. Delete Conversation

Delete a conversation and all its messages.

**Endpoint:** `DELETE /api/ai/conversations/:id`

**Authentication:** Required

#### Example Request

```bash
curl -X DELETE http://localhost:3000/api/ai/conversations/conv_xyz789 \
  -H "Authorization: Bearer <access_token>"
```

#### Success Response (200 OK)

```json
{
  "message": "Conversation deleted successfully"
}
```

---

### 5. Execute AI Action

Execute a suggested action from the AI response.

**Endpoint:** `POST /api/ai/actions`

**Authentication:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | string | Yes | Action type |
| `params` | object | Yes | Action parameters |
| `conversationId` | string | No | Related conversation |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/ai/actions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "action": "process_order",
    "params": {
      "orderId": "ord_001",
      "newStatus": "processing"
    },
    "conversationId": "conv_xyz789"
  }'
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Order ORD-2024-0150 has been updated to processing status",
  "result": {
    "orderId": "ord_001",
    "previousStatus": "pending",
    "newStatus": "processing"
  }
}
```

---

## Supported Queries

### Orders
- "Show me pending orders"
- "How many orders were placed today?"
- "What's the total revenue this month?"
- "Find orders from customer john@example.com"

### Users
- "List all admin users" (Admin only)
- "How many users registered this week?"
- "Show inactive user accounts"

### Analytics
- "What's my best selling product?"
- "Show sales trend for last 30 days"
- "Compare this week vs last week"

### Actions
- "Process order ORD-2024-0001"
- "Send invoice to customer"
- "Mark order as shipped"

---

## AI Capabilities

| Capability | Description |
|------------|-------------|
| **Query** | Natural language data queries |
| **Summarize** | Aggregate and summarize data |
| **Analyze** | Provide insights and trends |
| **Execute** | Perform actions on user's behalf |
| **Recommend** | Suggest next best actions |

---

## Context Object

Provide additional context to improve AI responses:

```json
{
  "context": {
    "currentPage": "orders",
    "selectedItems": ["ord_001", "ord_002"],
    "filters": {
      "status": "pending",
      "dateRange": "last_7_days"
    }
  }
}
```

---

## Rate Limits

| Plan | Requests/hour | Messages/day |
|------|---------------|--------------|
| Free | 50 | 100 |
| Pro | 500 | 1000 |
| Enterprise | Unlimited | Unlimited |

---

## Best Practices

1. **Be specific** - More detailed queries get better results
2. **Use context** - Provide relevant context for accurate responses
3. **Follow suggestions** - Use suggested actions for quick operations
4. **Maintain conversation** - Use conversationId for follow-up questions

---

## Error Handling

| Code | Description |
|------|-------------|
| 400 | Invalid message or parameters |
| 401 | Authentication required |
| 429 | Rate limit exceeded |
| 503 | AI service temporarily unavailable |

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Please try again in 5 minutes.",
  "retryAfter": 300
}
```
