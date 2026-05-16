# SmartLeads API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

---

## Auth

### POST /auth/register
Register a new user.

**Body:**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123", "role": "sales" }
```
`role` is optional — defaults to `"sales"`. Can be `"admin"` or `"sales"`.

**Response 201:**
```json
{ "success": true, "data": { "token": "...", "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "sales" } } }
```

---

### POST /auth/login
Login with email + password.

**Body:**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Response 200:**
```json
{ "success": true, "data": { "token": "...", "user": { ... } } }
```

---

### GET /auth/me 🔒
Get authenticated user info.

**Response 200:**
```json
{ "success": true, "data": { "_id": "...", "name": "Jane Doe", "email": "...", "role": "sales" } }
```

---

## Leads

### GET /leads 🔒
List leads with filters and pagination.

**Query Parameters:**
| Param | Type | Values |
|-------|------|--------|
| status | string | New, Contacted, Qualified, Lost |
| source | string | Website, Instagram, Referral |
| search | string | partial name or email match |
| sort | string | latest (default), oldest |
| page | number | default: 1 |
| limit | number | default: 10, max: 100 |

**Response 200:**
```json
{
  "success": true,
  "data": [{ "_id": "...", "name": "...", "email": "...", "status": "New", "source": "Website", "createdAt": "..." }],
  "meta": { "total": 42, "page": 1, "limit": 10, "totalPages": 5, "hasNextPage": true, "hasPrevPage": false }
}
```

---

### GET /leads/export 🔒 (admin only)
Export leads as CSV with optional filters.

**Query Parameters:** same as GET /leads except `page`, `sort`

**Response:** `text/csv` file download

---

### GET /leads/:id 🔒
Get a single lead by ID.

**Response 200:**
```json
{ "success": true, "data": { "_id": "...", "name": "...", ... } }
```

**Response 404:**
```json
{ "success": false, "message": "Lead not found" }
```

---

### POST /leads 🔒
Create a new lead.

**Body:**
```json
{ "name": "Rahul Sharma", "email": "rahul@example.com", "status": "New", "source": "Instagram" }
```

**Response 201:**
```json
{ "success": true, "data": { "_id": "...", ... } }
```

---

### PUT /leads/:id 🔒
Update a lead. Admin or Sales role.

**Body:** any subset of lead fields

**Response 200:**
```json
{ "success": true, "data": { "_id": "...", ... } }
```

---

### DELETE /leads/:id 🔒 (admin only)
Delete a lead permanently.

**Response 200:**
```json
{ "success": true, "message": "Lead deleted" }
```

---

## Stats

### GET /stats 🔒
Get aggregate counts by status and source.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "byStatus": { "New": 10, "Contacted": 15, "Qualified": 12, "Lost": 5 },
    "bySource": { "Website": 20, "Instagram": 14, "Referral": 8 }
  }
}
```

---

## Error Format

All errors follow this shape:
```json
{ "success": false, "message": "Human-readable error" }
```

Validation errors:
```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "msg": "Invalid email" }] }
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad request / validation |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong role) |
| 404 | Not found |
| 409 | Conflict (email taken) |
| 500 | Server error |
