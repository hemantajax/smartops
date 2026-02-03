# SmartOps AI - Documentation

Welcome to the SmartOps AI documentation. This folder contains all project documentation organized by area.

## Structure

```
docs/
├── backend/          # Backend API documentation
│   ├── README.md     # API overview & quick start
│   ├── auth.md       # Authentication endpoints
│   ├── users.md      # User management API
│   ├── orders.md     # Orders API
│   └── ai-assistant.md # AI Assistant API
│
└── frontend/         # Frontend documentation (coming soon)
    └── README.md     # Component library & guides
```

## Quick Links

### Backend API
- [API Overview](./backend/README.md) - Getting started with the API
- [Authentication](./backend/auth.md) - Login, register, tokens
- [Users API](./backend/users.md) - User management (Admin)
- [Orders API](./backend/orders.md) - Order management
- [AI Assistant](./backend/ai-assistant.md) - AI-powered features

### Frontend (Coming Soon)
- Component Library
- State Management
- Routing Guide
- Styling Guide

## Interactive Documentation

### Swagger UI (Backend)
When running the backend server:
```
http://localhost:3000/api/docs
```

### Storybook (Frontend) - Coming Soon
```
http://localhost:6006
```

## Contributing to Docs

1. Backend API docs go in `docs/backend/`
2. Frontend docs go in `docs/frontend/`
3. Use Markdown format
4. Include code examples where applicable
5. Keep docs in sync with code changes
