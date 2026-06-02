# System Architecture

## Overview

The Galewela Pubudu Sweets ERP system is built using a modern, scalable, cloud-native architecture with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  │  React SPA   │      │  Mobile App  │      │  3rd Party   │
│  │  (Web)       │      │  (Scanning)  │      │  Systems     │
│  └──────────────┘      └──────────────┘      └──────────────┘
└─────────────────────────────────────────────────────────────┘
                              ▼
                        ┌─────────────┐
                        │  API Gateway│
                        │ (Auth, Rate │
                        │  Limiting)  │
                        └─────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Microservices / API Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Inventory   │  │  Production  │  │  Quality     │      │
│  │  Service     │  │  Service     │  │  Service     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Sales &     │  │  Purchasing  │  │  Costing &   │      │
│  │  CRM Service │  │  Service     │  │  GL Service  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  Traceability│  │  Integration │                        │
│  │  Service     │  │  Service     │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
         ▼              ▼              ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────┐
│  PostgreSQL  │ │    Redis    │ │   Message   │
│  (Primary    │ │  (Cache,    │ │   Queue     │
│   DB)        │ │ Sessions)   │ │(RabbitMQ)   │
└──────────────┘ └─────────────┘ └──────────────┘
         ▼              ▼              ▼
┌──────────────────────────────────────────────────────────────┐
│            Cloud Infrastructure (AWS/Azure/GCP)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Load        │  │  Auto-Scale  │  │   S3/Blob   │      │
│  │  Balancer    │  │  Compute     │  │   Storage   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   CDN        │  │   Monitoring │  │   Logging    │      │
│  │   (Static)   │  │ (Prometheus) │  │   (ELK)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** React 18+ with TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS + Emotion
- **UI Components:** Custom components + Material-UI
- **HTTP Client:** Axios with interceptors
- **Form Management:** React Hook Form
- **Visualization:** Chart.js, D3.js for reports
- **Mobile:** React Native (optional, for scanning app)

### Backend
- **Runtime:** Node.js 18+ LTS
- **Framework:** Express.js or NestJS (for modularity)
- **Language:** TypeScript
- **ORM:** Sequelize or TypeORM
- **Validation:** Joi or Class-Validator
- **API Documentation:** Swagger/OpenAPI
- **Testing:** Jest, Supertest
- **Message Queue:** RabbitMQ or AWS SQS
- **Caching:** Redis with ioredis

### Database
- **Primary:** PostgreSQL 12+ (ACID transactions, JSON support, window functions)
- **Caching:** Redis (sessions, frequently accessed data)
- **Search:** Elasticsearch (optional, for large traceability queries)

### Authentication & Security
- **JWT:** jsonwebtoken for token generation/validation
- **OAuth2:** Passport.js integration
- **Password Hashing:** bcrypt/argon2
- **Secrets Management:** AWS Secrets Manager or Azure Key Vault
- **SSL/TLS:** Automatic certificate management (Let's Encrypt)

### Infrastructure & Deployment
- **Containerization:** Docker with multi-stage builds
- **Orchestration:** Kubernetes (EKS/AKS/GKE) or Docker Swarm
- **CI/CD:** GitHub Actions (build, test, deploy pipelines)
- **Monitoring:** Prometheus + Grafana
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **APM:** New Relic or DataDog (optional)
- **IaC:** Terraform for infrastructure provisioning

### External Integrations
- **Accounting:** QuickBooks API SDK, Xero API
- **E-Commerce:** Shopify REST Admin API, WooCommerce REST API
- **POS:** Square API, Toast API
- **Payments:** Stripe API, PayPal API
- **Email:** SendGrid or AWS SES
- **IoT:** AWS IoT Core, Azure IoT Hub

---

## Database Schema (Key Entities)

### Core Tables

#### Item (Inventory Master)
```sql
CREATE TABLE items (
  id UUID PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('raw_material', 'semi_finished', 'finished_good') NOT NULL,
  default_uom_id UUID,
  base_cost DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (default_uom_id) REFERENCES unit_of_measures(id)
);
```

#### Lot (Batch/Lot Tracking)
```sql
CREATE TABLE lots (
  id UUID PRIMARY KEY,
  item_id UUID NOT NULL,
  lot_number VARCHAR(50) NOT NULL UNIQUE,
  expiry_date DATE,
  quantity_available DECIMAL(15, 3) NOT NULL DEFAULT 0,
  quantity_reserved DECIMAL(15, 3) NOT NULL DEFAULT 0,
  status ENUM('available', 'quarantine', 'expired', 'scrapped') DEFAULT 'available',
  warehouse_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  INDEX idx_item_expiry (item_id, expiry_date),
  INDEX idx_status (status)
);
```

#### Recipe (BOM)
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY,
  item_id UUID NOT NULL,
  version INT NOT NULL DEFAULT 1,
  description TEXT,
  active_flag BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  UNIQUE(item_id, version)
);

CREATE TABLE recipe_components (
  id UUID PRIMARY KEY,
  recipe_id UUID NOT NULL,
  raw_item_id UUID NOT NULL,
  quantity DECIMAL(15, 3) NOT NULL,
  uom_id UUID NOT NULL,
  sub_recipe_id UUID,
  sequence INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (raw_item_id) REFERENCES items(id),
  FOREIGN KEY (uom_id) REFERENCES unit_of_measures(id),
  FOREIGN KEY (sub_recipe_id) REFERENCES recipes(id)
);
```

#### Production Order
```sql
CREATE TABLE production_orders (
  id UUID PRIMARY KEY,
  recipe_id UUID NOT NULL,
  qty_planned DECIMAL(15, 3) NOT NULL,
  qty_completed DECIMAL(15, 3) DEFAULT 0,
  status ENUM('draft', 'scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'draft',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id),
  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date)
);

CREATE TABLE wip_entries (
  id UUID PRIMARY KEY,
  production_order_id UUID NOT NULL,
  stage_name VARCHAR(100),
  qty_entered DECIMAL(15, 3),
  qty_exited DECIMAL(15, 3),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (production_order_id) REFERENCES production_orders(id) ON DELETE CASCADE
);

CREATE TABLE waste_records (
  id UUID PRIMARY KEY,
  production_order_id UUID NOT NULL,
  item_id UUID,
  quantity DECIMAL(15, 3),
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (production_order_id) REFERENCES production_orders(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);
```

#### Quality & Inspection
```sql
CREATE TABLE inspection_plans (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('incoming', 'in_process', 'finished_goods') NOT NULL,
  checklist_items JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inspection_results (
  id UUID PRIMARY KEY,
  lot_id UUID,
  production_order_id UUID,
  inspection_plan_id UUID NOT NULL,
  result ENUM('pass', 'fail', 'partial') NOT NULL,
  values JSONB,
  inspection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES lots(id),
  FOREIGN KEY (production_order_id) REFERENCES production_orders(id),
  FOREIGN KEY (inspection_plan_id) REFERENCES inspection_plans(id),
  INDEX idx_result (result)
);

CREATE TABLE non_conformances (
  id UUID PRIMARY KEY,
  lot_id UUID,
  item_id UUID,
  description TEXT NOT NULL,
  status ENUM('open', 'assigned', 'closed') DEFAULT 'open',
  reported_by UUID NOT NULL,
  reported_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES lots(id),
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (reported_by) REFERENCES users(id)
);

CREATE TABLE capas (
  id UUID PRIMARY KEY,
  non_conformance_id UUID NOT NULL,
  action_plan TEXT NOT NULL,
  assigned_to UUID,
  status ENUM('open', 'in_progress', 'completed') DEFAULT 'open',
  resolution_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (non_conformance_id) REFERENCES non_conformances(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

#### Traceability
```sql
CREATE TABLE lot_trace (
  id UUID PRIMARY KEY,
  parent_lot_id UUID,
  child_lot_id UUID,
  production_order_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_lot_id) REFERENCES lots(id) ON DELETE CASCADE,
  FOREIGN KEY (child_lot_id) REFERENCES lots(id) ON DELETE CASCADE,
  FOREIGN KEY (production_order_id) REFERENCES production_orders(id),
  INDEX idx_parent (parent_lot_id),
  INDEX idx_child (child_lot_id)
);
```

#### Sales & Purchasing
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  contact_info JSONB,
  payment_terms VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_orders (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('draft', 'confirmed', 'shipped', 'invoiced', 'cancelled') DEFAULT 'draft',
  total_amount DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  INDEX idx_status (status)
);

CREATE TABLE sales_order_items (
  id UUID PRIMARY KEY,
  sales_order_id UUID NOT NULL,
  item_id UUID NOT NULL,
  quantity DECIMAL(15, 3) NOT NULL,
  uom_id UUID NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (uom_id) REFERENCES unit_of_measures(id)
);

CREATE TABLE suppliers (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  contact_info JSONB,
  rating DECIMAL(3, 1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY,
  supplier_id UUID NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('draft', 'sent', 'acknowledged', 'received', 'invoiced', 'cancelled') DEFAULT 'draft',
  total_amount DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  INDEX idx_status (status)
);

CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY,
  purchase_order_id UUID NOT NULL,
  item_id UUID NOT NULL,
  quantity DECIMAL(15, 3) NOT NULL,
  uom_id UUID NOT NULL,
  unit_cost DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (uom_id) REFERENCES unit_of_measures(id)
);

CREATE TABLE goods_receipts (
  id UUID PRIMARY KEY,
  purchase_order_id UUID NOT NULL,
  lot_id UUID,
  received_qty DECIMAL(15, 3) NOT NULL,
  receipt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id),
  FOREIGN KEY (lot_id) REFERENCES lots(id)
);
```

#### Costing & Accounting
```sql
CREATE TABLE cost_methods (
  id UUID PRIMARY KEY,
  name ENUM('FIFO', 'LIFO', 'Weighted_Average', 'Standard', 'Actual') NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE stock_valuations (
  id UUID PRIMARY KEY,
  item_id UUID NOT NULL,
  lot_id UUID,
  valuation_method_id UUID NOT NULL,
  value DECIMAL(15, 2) NOT NULL,
  quantity DECIMAL(15, 3),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (lot_id) REFERENCES lots(id),
  FOREIGN KEY (valuation_method_id) REFERENCES cost_methods(id)
);

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  gl_account_id VARCHAR(50) NOT NULL,
  debit DECIMAL(15, 2) DEFAULT 0,
  credit DECIMAL(15, 2) DEFAULT 0,
  entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  reference_id UUID,
  reference_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_account (gl_account_id),
  INDEX idx_date (entry_date)
);
```

#### User & Security
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  role_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE(user_id, role_id)
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
  id UUID PRIMARY KEY,
  role_id UUID NOT NULL,
  permission_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);
```

---

## API Architecture

### REST API Principles
- **Versioning:** `/api/v1/...` in URL path
- **Authentication:** JWT Bearer token in Authorization header
- **Status Codes:** Standard HTTP (200, 201, 400, 401, 403, 404, 500)
- **Response Format:** JSON with consistent structure
- **Rate Limiting:** 1000 req/min per user, burst: 100 req/10s
- **Pagination:** Limit (default: 20, max: 100), offset
- **Sorting:** Multiple column support with asc/desc

### Response Structure
```json
{
  "success": true,
  "data": { },
  "message": "Operation completed",
  "timestamp": "2026-06-02T12:34:56Z",
  "request_id": "req-uuid"
}
```

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "name", "message": "Name is required" }
    ]
  },
  "timestamp": "2026-06-02T12:34:56Z",
  "request_id": "req-uuid"
}
```

---

## Deployment Architecture

### Development Environment
```yaml
docker-compose:
  services:
    api: # Node.js app
    web: # React app
    postgres: # Database
    redis: # Cache
    rabbitmq: # Message queue
```

### Staging/Production Environment (AWS Example)
```
┌─────────────────┐
│   Route 53      │
│   (DNS)         │
└────────┬────────┘
         │
    ┌────▼──────┐
    │   ALB      │
    │   (HTTPS)  │
    └────┬───────┘
         │
    ┌────▼────────────────┐
    │  EKS Cluster        │
    │  ┌────────────────┐ │
    │  │ API Pods (3+)  │ │
    │  ├────────────────┤ │
    │  │ Web Pods (3+)  │ │
    │  ├────────────────┤ │
    │  │ Worker Pods    │ │
    │  └────────────────┘ │
    └────┬────────────────┘
         │
    ┌────┼────────────────┐
    │    │                │
┌───▼──┐│  ┌────────┐  ┌──▼─────┐
│ RDS  ││  │ ElastiC│  │  S3    │
│(PG)  ││  │ Cache  │  │ (Docs) │
│      ││  │(Redis) │  │        │
└──────┘│  └────────┘  └────────┘
        │
    ┌───▼────────┐
    │ SQS/SNS    │
    │ (Messaging)│
    └────────────┘
```

### CI/CD Pipeline
```yaml
Trigger: Git Push → GitHub Actions
  ├─ Build: Compile TypeScript, bundle
  ├─ Test: Unit tests (Jest), Integration tests
  ├─ Lint: ESLint, code quality (SonarQube)
  ├─ Security: Dependency scan (Snyk), SAST
  ├─ Build Image: Docker image creation, push to ECR
  └─ Deploy: 
      ├─ Staging: Automatically deploy to staging
      └─ Production: Manual approval gate, deploy to prod
```

---

## Security Architecture

### Authentication Flow
```
1. User Login (username/password)
   ↓
2. Verify credentials (bcrypt compare)
   ↓
3. Generate JWT (accessToken + refreshToken)
   ↓
4. Return tokens to client
   ↓
5. Client stores tokens (secure storage on mobile, memory on web)
   ↓
6. API requests include: Authorization: Bearer {accessToken}
   ↓
7. Middleware validates JWT signature & expiry
   ↓
8. On expiry, client uses refreshToken to get new accessToken
```

### Authorization (RBAC)
```
User → Roles (Admin, Manager, Operator, QA, Finance)
     → Permissions (module:action)
     
Example:
- Admin: All permissions
- Manager: inventory:read, inventory:write, sales:read, reports:read
- Operator: inventory:read, production:read, production:write
- QA: quality:read, quality:write
- Finance: costing:read, accounting:read
```

### Data Security
- **Encryption at Rest:** DB encryption (AWS KMS), S3 encryption
- **Encryption in Transit:** TLS 1.3 for all communications
- **Secret Management:** AWS Secrets Manager for API keys, DB creds
- **Audit Logging:** All actions logged with user, timestamp, changes
- **Row-Level Security:** Optionally restrict data by warehouse/region

---

## Performance Optimization

### Caching Strategy
- **HTTP Cache:** Static assets cached by CDN (1 year)
- **Application Cache:** Redis for frequently queried data
  - Item master (cache invalidate on update)
  - Lot availability (TTL: 5 min)
  - User permissions (TTL: 1 hour)
  - Exchange rates, UOM conversions (TTL: 24 hours)
- **Database Query Optimization:**
  - Proper indexing on frequently filtered/sorted columns
  - Connection pooling (PgBouncer)
  - Query optimization and explain plans

### Frontend Performance
- **Code Splitting:** Route-based lazy loading
- **Bundle Optimization:** Tree shaking, minification
- **Image Optimization:** WebP format, responsive images
- **API Optimization:** Batch endpoints for multiple operations

### Backend Performance
- **Pagination:** Always paginate large result sets
- **Asynchronous Processing:** Long-running operations (reports, exports) → message queue
- **Database Connection Pooling:** Max 20 connections per service
- **Horizontal Scaling:** Stateless services behind load balancer

---

## Disaster Recovery & Business Continuity

### Backup Strategy
- **Database:** Daily automated backups, 30-day retention, tested restores
- **Files:** S3 cross-region replication, versioning enabled
- **Configuration:** IaC in Git (immutable history)
- **RTO:** 4 hours; RPO: 1 hour

### High Availability
- **Load Balancing:** Multi-AZ deployment with ALB
- **Database Replication:** Primary + standby with automatic failover
- **Monitoring:** Real-time alerts on health checks
- **Auto-Scaling:** Horizontal scaling based on CPU/memory metrics

### Monitoring & Alerting
- **Application Metrics:** Prometheus (request latency, errors, throughput)
- **Infrastructure:** CloudWatch/Azure Monitor (CPU, memory, disk)
- **Logging:** ELK Stack for centralized logging and analysis
- **Alerts:** PagerDuty/OpsGenie integration for on-call escalation

---

Last updated: June 2, 2026
