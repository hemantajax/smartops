# SmartOps AI - API Documentation

## Overview

SmartOps AI provides a RESTful API for managing business operations with AI-powered assistance. This documentation covers all available endpoints, authentication, and usage examples.

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.smartops.ai/api
```

## Interactive Documentation (Swagger)

When running the backend server, Swagger UI is available at:
```
http://localhost:3000/api/docs
```

## Authentication

Most API endpoints require authentication using JWT (JSON Web Tokens).

### How to Authenticate

1. **Register** a new account or **Login** with existing credentials
2. You'll receive an `accessToken` and `refreshToken`
3. Include the access token in the `Authorization` header:

```http
Authorization: Bearer <your_access_token>
```

### Token Expiration

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

When your access token expires, use the `/auth/refresh` endpoint with your refresh token to get new tokens.

## API Modules

| Module | Description | Documentation |
|--------|-------------|---------------|
| [Auth](./auth.md) | Authentication & Authorization | User registration, login, logout |
| [Users](./users.md) | User Management | CRUD operations for users (Admin only) |
| [Orders](./orders.md) | Order Management | Business orders and transactions |
| [AI Assistant](./ai-assistant.md) | AI-Powered Help | Natural language queries and actions |

## Response Format

### Success Response

```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Authenticated users**: 1000 requests per hour
- **Unauthenticated**: 100 requests per hour

## Quick Start

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Access Protected Endpoint

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <your_access_token>"
```

## SDK Support (Coming Soon)

- JavaScript/TypeScript
- Python
- Go

## Need Help?

- Check the [Swagger Documentation](http://localhost:3000/api/docs)
- Review individual API module docs
- Contact support at support@smartops.ai
