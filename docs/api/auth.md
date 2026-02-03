# Authentication API

Authentication endpoints for user registration, login, and token management.

## Base Path

```
/api/auth
```

---

## Endpoints

### 1. Register New User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | User's full name (min 2 characters) |
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Password (min 6 characters) |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Success Response (201 Created)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 | Validation error - Invalid input data |
| 409 | Email already registered |

---

### 2. Login

Authenticate user and get access tokens.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Registered email address |
| `password` | string | Yes | Account password |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Success Response (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 401 | Invalid email or password |

---

### 3. Refresh Tokens

Get new access and refresh tokens using a valid refresh token.

**Endpoint:** `POST /api/auth/refresh`

**Authentication:** Not required (uses refresh token in body)

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refreshToken` | string | Yes | Valid refresh token |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

#### Success Response (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 401 | Invalid or expired refresh token |

---

### 4. Logout

Invalidate current session and optionally revoke refresh token.

**Endpoint:** `POST /api/auth/logout`

**Authentication:** Required (Bearer Token)

#### Headers

```http
Authorization: Bearer <access_token>
```

#### Request Body (Optional)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refreshToken` | string | No | Refresh token to invalidate |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

#### Success Response (200 OK)

```json
{
  "message": "Logged out successfully"
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 401 | Invalid or missing access token |

---

### 5. Get Current User

Get the authenticated user's profile information.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required (Bearer Token)

#### Headers

```http
Authorization: Bearer <access_token>
```

#### Example Request

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

#### Success Response (200 OK)

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 401 | Invalid or missing access token |

---

## Token Management Best Practices

### Storing Tokens

- **Access Token**: Store in memory (not localStorage for security)
- **Refresh Token**: Store in httpOnly cookie or secure storage

### Token Refresh Flow

```
1. Make API request with access token
2. If 401 response, try refreshing tokens
3. If refresh successful, retry original request
4. If refresh fails, redirect to login
```

### JavaScript Example

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await api.post('/auth/refresh', {
          refreshToken: getRefreshToken()
        });
        setTokens(data.accessToken, data.refreshToken);
        // Retry original request
        return api(error.config);
      } catch {
        // Redirect to login
        logout();
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Security Notes

1. **Never expose tokens** in URLs or logs
2. **Use HTTPS** in production
3. **Implement token rotation** for refresh tokens
4. **Set appropriate CORS** policies
5. **Consider using httpOnly cookies** for refresh tokens
