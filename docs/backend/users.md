# Users API

User management endpoints for administrators to manage user accounts.

## Base Path

```
/api/users
```

**Note:** All endpoints in this module require `admin` role.

---

## Endpoints

### 1. List All Users

Get a paginated list of all users.

**Endpoint:** `GET /api/users`

**Authentication:** Required (Admin only)

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 100) |
| `search` | string | - | Search by name or email |
| `role` | string | - | Filter by role (user, admin) |
| `status` | string | - | Filter by status (active, inactive) |

#### Example Request

```bash
curl "http://localhost:3000/api/users?page=1&limit=10&search=john" \
  -H "Authorization: Bearer <admin_access_token>"
```

#### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 2. Get User by ID

Get details of a specific user.

**Endpoint:** `GET /api/users/:id`

**Authentication:** Required (Admin only)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | User UUID |

#### Example Request

```bash
curl http://localhost:3000/api/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <admin_access_token>"
```

#### Success Response (200 OK)

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 404 | User not found |

---

### 3. Create User

Create a new user account (admin creation).

**Endpoint:** `POST /api/users`

**Authentication:** Required (Admin only)

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | User's full name |
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Initial password |
| `role` | string | No | User role (default: "user") |
| `status` | string | No | Account status (default: "active") |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_access_token>" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "user"
  }'
```

#### Success Response (201 Created)

```json
{
  "id": "456e7890-e89b-12d3-a456-426614174000",
  "email": "jane@example.com",
  "name": "Jane Smith",
  "role": "user",
  "status": "active",
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 409 | Email already exists |

---

### 4. Update User

Update an existing user's information.

**Endpoint:** `PATCH /api/users/:id`

**Authentication:** Required (Admin only)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | User UUID |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | User's full name |
| `email` | string | No | Valid email address |
| `role` | string | No | User role |
| `status` | string | No | Account status |

#### Example Request

```bash
curl -X PATCH http://localhost:3000/api/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_access_token>" \
  -d '{
    "name": "John Smith",
    "role": "admin"
  }'
```

#### Success Response (200 OK)

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john@example.com",
  "name": "John Smith",
  "role": "admin",
  "status": "active",
  "updatedAt": "2024-01-20T00:00:00.000Z"
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 404 | User not found |
| 409 | Email already in use |

---

### 5. Delete User

Delete a user account.

**Endpoint:** `DELETE /api/users/:id`

**Authentication:** Required (Admin only)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | User UUID |

#### Example Request

```bash
curl -X DELETE http://localhost:3000/api/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <admin_access_token>"
```

#### Success Response (200 OK)

```json
{
  "message": "User deleted successfully"
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 404 | User not found |
| 403 | Cannot delete own account |

---

### 6. Update User Password

Reset a user's password (admin action).

**Endpoint:** `PATCH /api/users/:id/password`

**Authentication:** Required (Admin only)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | User UUID |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `newPassword` | string | Yes | New password (min 6 characters) |

#### Example Request

```bash
curl -X PATCH http://localhost:3000/api/users/123e4567-e89b-12d3-a456-426614174000/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_access_token>" \
  -d '{
    "newPassword": "newpassword123"
  }'
```

#### Success Response (200 OK)

```json
{
  "message": "Password updated successfully"
}
```

---

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `user` | Regular user | Access own data, create orders |
| `admin` | Administrator | Full access to all resources |

## User Status

| Status | Description |
|--------|-------------|
| `active` | User can login and access the system |
| `inactive` | User account is disabled |
| `pending` | User needs to verify email |
