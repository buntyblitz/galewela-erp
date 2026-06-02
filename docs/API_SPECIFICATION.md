# API Specification

## Base URL
```
Development: http://localhost:3001/api/v1
Production: https://api.galewela.com/api/v1
```

## Authentication

All endpoints (except `/login` and `/register`) require a Bearer token in the `Authorization` header:

```
Authorization: Bearer {jwt_token}
```

### Login Endpoint
**POST** `/auth/login`

Request:
```json
{
  "username": "user@galewela.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "username": "user@galewela.com",
      "roles": ["operator"]
    }
  }
}
```

---

## Core API Endpoints

### 1. Inventory Management

#### Get All Items
**GET** `/items`

Query Parameters:
- `type` (optional): `raw_material`, `semi_finished`, `finished_good`
- `limit` (optional): Default 20, Max 100
- `offset` (optional): Default 0
- `search` (optional): Search by name or code

Response (200):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "code": "SUGAR-001",
        "name": "White Sugar",
        "type": "raw_material",
        "default_uom_id": "uom-kg",
        "base_cost": 45.50,
        "created_at": "2026-06-01T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 20,
      "offset": 0
    }
  }
}
```

#### Create Item
**POST** `/items`

Request:
```json
{
  "code": "SUGAR-002",
  "name": "Brown Sugar",
  "type": "raw_material",
  "default_uom_id": "uom-kg",
  "base_cost": 50.00,
  "description": "Premium brown sugar"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "SUGAR-002",
    "name": "Brown Sugar",
    ...
  }
}
```

#### Get Lots for Item
**GET** `/items/{itemId}/lots`

Response (200):
```json
{
  "success": true,
  "data": {
    "lots": [
      {
        "id": "uuid",
        "lot_number": "LOT-2026-001",
        "expiry_date": "2026-12-31",
        "quantity_available": 100,
        "quantity_reserved": 20,
        "status": "available",
        "warehouse_id": "wh-001"
      }
    ]
  }
}
```

#### Record Stock Movement
**POST** `/stock_entries`

Request:
```json
{
  "item_id": "uuid",
  "lot_id": "uuid",
  "quantity": 50,
  "warehouse_id": "wh-001",
  "movement_type": "in",
  "reference_type": "goods_receipt",
  "reference_id": "po-123"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "item_id": "uuid",
    "quantity": 50,
    "movement_type": "in",
    "timestamp": "2026-06-02T12:34:56Z"
  }
}
```

---

### 2. Production Management

#### Get Production Orders
**GET** `/production_orders`

Query Parameters:
- `status`: `draft`, `scheduled`, `in_progress`, `completed`
- `recipe_id` (optional)
- `limit`, `offset` for pagination

Response (200):
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "recipe_id": "uuid",
        "qty_planned": 1000,
        "qty_completed": 0,
        "status": "draft",
        "start_date": "2026-06-05T08:00:00Z",
        "end_date": null
      }
    ]
  }
}
```

#### Create Production Order
**POST** `/production_orders`

Request:
```json
{
  "recipe_id": "uuid",
  "qty_planned": 1000,
  "start_date": "2026-06-05T08:00:00Z"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "recipe_id": "uuid",
    "qty_planned": 1000,
    "status": "draft"
  }
}
```

#### Complete Production Order
**PUT** `/production_orders/{id}/complete`

Request:
```json
{
  "qty_completed": 950,
  "waste_details": [
    {
      "item_id": "uuid",
      "quantity": 50,
      "reason": "quality_rejection"
    }
  ]
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "qty_completed": 950,
    "status": "completed",
    "yield_percentage": 95.0
  }
}
```

#### Get Recipes/BOMs
**GET** `/recipes`

Response (200):
```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "uuid",
        "item_id": "uuid",
        "version": 1,
        "active_flag": true,
        "components": [
          {
            "raw_item_id": "uuid",
            "quantity": 100,
            "uom_id": "uom-kg"
          }
        ]
      }
    ]
  }
}
```

#### Create Recipe
**POST** `/recipes`

Request:
```json
{
  "item_id": "uuid",
  "description": "Chocolate Bar Recipe v1",
  "components": [
    {
      "raw_item_id": "uuid",
      "quantity": 500,
      "uom_id": "uom-g"
    }
  ]
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "item_id": "uuid",
    "version": 1,
    "components": [...]
  }
}
```

---

### 3. Quality Control

#### Create Inspection
**POST** `/inspections`

Request:
```json
{
  "lot_id": "uuid",
  "inspection_plan_id": "uuid",
  "result": "pass",
  "values": {
    "color": "brown",
    "texture": "smooth",
    "weight": 100
  }
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "lot_id": "uuid",
    "result": "pass",
    "inspection_date": "2026-06-02T12:34:56Z"
  }
}
```

#### Create Non-Conformance
**POST** `/nonconformances`

Request:
```json
{
  "lot_id": "uuid",
  "description": "Color does not match specification",
  "reported_by": "user-uuid"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "lot_id": "uuid",
    "status": "open",
    "reported_date": "2026-06-02T12:34:56Z"
  }
}
```

#### Create CAPA
**POST** `/capas`

Request:
```json
{
  "non_conformance_id": "uuid",
  "action_plan": "Adjust color temperature in mixing process",
  "assigned_to": "user-uuid"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "non_conformance_id": "uuid",
    "status": "open",
    "action_plan": "..."
  }
}
```

---

### 4. Traceability

#### Forward Trace
**GET** `/trace/forward?lot={lot_id}`

Response (200):
```json
{
  "success": true,
  "data": {
    "lot_id": "uuid",
    "trace_type": "forward",
    "genealogy": [
      {
        "level": 1,
        "type": "production_output",
        "lot_id": "finished-uuid",
        "item_name": "Chocolate Bar",
        "quantity": 950
      },
      {
        "level": 2,
        "type": "sales_order",
        "sales_order_id": "so-123",
        "customer": "Retailer ABC",
        "quantity": 500
      }
    ]
  }
}
```

#### Backward Trace
**GET** `/trace/backward?lot={lot_id}`

Response (200):
```json
{
  "success": true,
  "data": {
    "lot_id": "uuid",
    "trace_type": "backward",
    "genealogy": [
      {
        "level": 1,
        "type": "production_input",
        "parent_lot_id": "raw-uuid",
        "item_name": "Cocoa Powder",
        "quantity": 500
      },
      {
        "level": 2,
        "type": "goods_receipt",
        "purchase_order_id": "po-456",
        "supplier": "Supplier XYZ",
        "quantity": 500
      }
    ]
  }
}
```

#### Create Recall
**POST** `/recalls`

Request:
```json
{
  "lot_id": "uuid",
  "reason": "Contamination detected",
  "severity": "critical"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "lot_id": "uuid",
    "reason": "Contamination detected",
    "affected_lots": ["uuid1", "uuid2"],
    "status": "active"
  }
}
```

---

### 5. Sales & CRM

#### Get Sales Orders
**GET** `/sales_orders`

Response (200):
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "customer_id": "uuid",
        "order_date": "2026-06-01T10:00:00Z",
        "status": "confirmed",
        "total_amount": 5000,
        "items": [
          {
            "item_id": "uuid",
            "quantity": 100,
            "unit_price": 50
          }
        ]
      }
    ]
  }
}
```

#### Create Sales Order
**POST** `/sales_orders`

Request:
```json
{
  "customer_id": "uuid",
  "items": [
    {
      "item_id": "uuid",
      "quantity": 100,
      "unit_price": 50
    }
  ]
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "customer_id": "uuid",
    "status": "draft",
    "total_amount": 5000
  }
}
```

---

### 6. Purchasing

#### Get Purchase Orders
**GET** `/purchase_orders`

Response (200):
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "supplier_id": "uuid",
        "order_date": "2026-06-01T10:00:00Z",
        "status": "sent",
        "total_amount": 10000
      }
    ]
  }
}
```

#### Create Purchase Order
**POST** `/purchase_orders`

Request:
```json
{
  "supplier_id": "uuid",
  "items": [
    {
      "item_id": "uuid",
      "quantity": 500,
      "unit_cost": 20
    }
  ]
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "supplier_id": "uuid",
    "status": "draft",
    "total_amount": 10000
  }
}
```

#### Record Goods Receipt
**POST** `/goods_receipts`

Request:
```json
{
  "purchase_order_id": "uuid",
  "lot_number": "LOT-2026-001",
  "received_qty": 500,
  "received_uom": "kg"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "purchase_order_id": "uuid",
    "lot_id": "uuid",
    "received_qty": 500
  }
}
```

---

### 7. Costing & Reporting

#### Get Costing Report
**GET** `/costing_report`

Query Parameters:
- `item_id` (optional)
- `lot_id` (optional)
- `date_from` (optional)
- `date_to` (optional)

Response (200):
```json
{
  "success": true,
  "data": {
    "report": [
      {
        "item_id": "uuid",
        "lot_id": "uuid",
        "quantity": 100,
        "standard_cost": 5000,
        "actual_cost": 4950,
        "variance": -50,
        "variance_percent": -1.0,
        "cost_method": "FIFO"
      }
    ]
  }
}
```

#### Get Dashboard Data
**GET** `/dashboard_data`

Response (200):
```json
{
  "success": true,
  "data": {
    "inventory": {
      "total_items": 150,
      "raw_materials": 75,
      "finished_goods": 45,
      "total_value": 500000
    },
    "production": {
      "active_orders": 5,
      "avg_yield": 96.5,
      "total_waste": 250
    },
    "quality": {
      "total_inspections": 120,
      "pass_rate": 98.3,
      "open_ncs": 3
    },
    "sales": {
      "pending_orders": 8,
      "total_revenue": 250000
    }
  }
}
```

#### Get Reports
**GET** `/reports/{report_id}`

Common Reports:
- `inventory_aging` - Stock aged inventory
- `production_efficiency` - Yield and efficiency metrics
- `quality_metrics` - QC pass rates and trends
- `expiry_alert` - Items expiring soon
- `batch_costing` - Cost analysis by batch

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "quantity",
        "message": "Must be greater than 0"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing token"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Rate Limiting

All endpoints are rate-limited to **1000 requests per minute** per user.

Response headers:
- `X-RateLimit-Limit: 1000`
- `X-RateLimit-Remaining: 999`
- `X-RateLimit-Reset: 1234567890`

Exceeding the limit returns **429 Too Many Requests**.

---

Last updated: June 2, 2026
