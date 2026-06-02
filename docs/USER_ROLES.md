# User Roles & Permissions

## Role Hierarchy

```
┌─────────────────────────────────────┐
│         Administrator               │
│  (Full system access)               │
└─────────┬───────────────────────────┘
          │
    ┌─────┴─────┬──────────┬──────────┐
    │           │          │          │
┌───▼──┐  ┌─────▼──┐  ┌───▼──┐  ┌───▼──┐
│Mgr   │  │Finance │  │QA    │  │Ops   │
│      │  │        │  │      │  │      │
└───┬──┘  └────────┘  └──────┘  └──────┘
    │
┌───┴──────────┬──────────┐
│              │          │
┌─▼─┐      ┌───▼──┐  ┌───▼──┐
│WH │      │Prod  │  │Sales │
│Op │      │Op    │  │Op    │
└───┘      └──────┘  └──────┘
```

## Role Definitions

### 1. Administrator
**Full system access, configuration, and user management**

Permissions:
- ✅ All actions on all modules
- ✅ User and role management
- ✅ System settings and configuration
- ✅ Integration setup
- ✅ Audit log access
- ✅ Backup and disaster recovery

### 2. Manager
**Oversight and approval authority**

Permissions:
- ✅ View all reports and dashboards
- ✅ Approve production orders
- ✅ Approve purchase orders >threshold
- ✅ Create and edit recipes
- ✅ Review quality metrics
- ✅ Manage suppliers
- ✅ View costing reports
- ❌ Delete any records (audit trail only)

### 3. Finance Manager
**Financial operations and costing**

Permissions:
- ✅ View all costing reports
- ✅ Generate journal entries
- ✅ Approve invoices
- ✅ View GL ledger
- ✅ Create accounting adjustments
- ✅ Generate financial reports
- ✅ Manage cost methods
- ❌ Delete transactions

### 4. Quality Assurance Manager
**Quality control and compliance**

Permissions:
- ✅ Create and edit inspection plans
- ✅ Approve/reject inspection results
- ✅ Create and track non-conformances
- ✅ Create and approve CAPAs
- ✅ View audit trail
- ✅ Generate QC reports
- ✅ Manage CoAs
- ✅ Configure HACCP parameters

### 5. Operations Manager
**Production scheduling and oversight**

Permissions:
- ✅ Create and schedule production orders
- ✅ View production KPIs
- ✅ Manage inventory levels
- ✅ Approve purchase orders
- ✅ View all warehouse operations
- ✅ Create shipments
- ✅ Access production reports

### 6. Warehouse Operator
**Physical inventory operations**

Permissions:
- ✅ View item catalog
- ✅ Record goods receipt
- ✅ Record stock transfers
- ✅ Perform cycle counts
- ✅ Record inventory adjustments
- ✅ Scan barcodes/QR codes
- ✅ Pick and pack for shipments
- ❌ Create purchase orders
- ❌ Modify item master

### 7. Production Operator
**Manufacturing execution**

Permissions:
- ✅ View assigned production orders
- ✅ Record production start/completion
- ✅ Record waste and scrap
- ✅ Perform in-process QC
- ✅ Issue materials to production
- ✅ Record WIP entries
- ❌ Modify production plans
- ❌ Approve production orders

### 8. Sales Operator
**Order and customer management**

Permissions:
- ✅ Create and manage sales orders
- ✅ View customer information
- ✅ Check inventory availability
- ✅ Generate quotes
- ✅ Create shipments
- ✅ View sales reports
- ✅ Access order history
- ❌ Approve orders
- ❌ Set pricing

## Permission Matrix

| Module | Admin | Mgr | Finance | QA | Ops | WH | Prod | Sales |
|--------|-------|-----|---------|----|----|-----|------|-------|
| **Inventory** |       |     |         |    |    |     |      |       |
| View   | ✅    | ✅  | ✅      | ✅ | ✅ | ✅  | ✅   | ✅    |
| Create | ✅    | ✅  | ❌      | ❌ | ✅ | ❌  | ❌   | ❌    |
| Edit   | ✅    | ✅  | ❌      | ❌ | ✅ | ❌  | ❌   | ❌    |
| Delete | ✅    | ❌  | ❌      | ❌ | ❌ | ❌  | ❌   | ❌    |
| **Production** |     |     |         |    |    |     |      |       |
| View   | ✅    | ✅  | ✅      | ✅ | ✅ | ❌  | ✅   | ❌    |
| Create | ✅    | ✅  | ❌      | ❌ | ✅ | ❌  | ❌   | ❌    |
| Execute | ✅   | ✅  | ❌      | ❌ | ✅ | ❌  | ✅   | ❌    |
| Approve | ✅   | ✅  | ❌      | ❌ | ✅ | ❌  | ❌   | ❌    |
| **Quality** |   |     |         |    |    |     |      |       |
| View   | ✅    | ✅  | ❌      | ✅ | ✅ | ❌  | ✅   | ❌    |
| Create | ✅    | ❌  | ❌      | ✅ | ❌ | ❌  | ✅   | ❌    |
| Approve | ✅   | ❌  | ❌      | ✅ | ❌ | ❌  | ❌   | ❌    |
| **Sales** |    |     |         |    |    |     |      |       |
| View   | ✅    | ✅  | ✅      | ❌ | ✅ | ❌  | ❌   | ✅    |
| Create | ✅    | ✅  | ❌      | ❌ | ✅ | ❌  | ❌   | ✅    |
| Approve | ✅   | ✅  | ❌      | ❌ | ✅ | ❌  | ❌   | ❌    |
| **Purchasing** | |   |         |    |    |     |      |       |
| View   | ✅    | ✅  | ✅      | ❌ | ✅ | ✅  | ❌   | ❌    |
| Create | ✅    | ✅  | ❌      | ❌ | ✅ | ❌  | ❌   | ❌    |
| Approve | ✅   | ✅  | ❌      | ❌ | ✅ | ❌  | ❌   | ❌    |
| **Costing** |   |     |         |    |    |     |      |       |
| View   | ✅    | ✅  | ✅      | ❌ | ✅ | ❌  | ❌   | ❌    |
| Create | ✅    | ❌  | ✅      | ❌ | ❌ | ❌  | ❌   | ❌    |
| Approve | ✅   | ❌  | ✅      | ❌ | ❌ | ❌  | ❌   | ❌    |
| **Reports** |   |     |         |    |    |     |      |       |
| View All | ✅  | ✅  | ✅      | ✅ | ✅ | ✅  | ✅   | ✅    |
| Export | ✅    | ✅  | ✅      | ✅ | ✅ | ❌  | ❌   | ✅    |
| **Administration** | | |       |    |    |     |      |       |
| Users  | ✅    | ❌  | ❌      | ❌ | ❌ | ❌  | ❌   | ❌    |
| Roles  | ✅    | ❌  | ❌      | ❌ | ❌ | ❌  | ❌   | ❌    |
| Config | ✅    | ❌  | ❌      | ❌ | ❌ | ❌  | ❌   | ❌    |
| Audit  | ✅    | ✅  | ✅      | ✅ | ✅ | ❌  | ❌   | ❌    |

## Default Permissions

Each role has granular permissions:

```json
{
  "role_id": "uuid",
  "permissions": [
    {
      "resource": "inventory",
      "action": "view",
      "scope": "all"
    },
    {
      "resource": "inventory",
      "action": "create",
      "scope": "own_warehouse"
    },
    {
      "resource": "production",
      "action": "view",
      "scope": "all"
    },
    {
      "resource": "production",
      "action": "execute",
      "scope": "assigned"
    }
  ]
}
```

### Actions
- `view` - Can see records
- `create` - Can create new records
- `edit` - Can modify existing records
- `delete` - Can delete records
- `approve` - Can approve pending actions
- `execute` - Can perform operations (e.g., start production)
- `export` - Can export data
- `audit` - Can view audit logs

### Scopes
- `all` - All records in the system
- `own_warehouse` - Only records in assigned warehouse
- `own_department` - Only own department's records
- `assigned` - Only personally assigned records

## Implementation Guidelines

### API Authorization
```typescript
// Middleware example
async function checkPermission(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  const requiredPermission = {
    resource: 'inventory',
    action: 'create'
  };
  
  const hasPermission = await PermissionService.check(
    user.id,
    requiredPermission
  );
  
  if (!hasPermission) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN' }
    });
  }
  
  next();
}
```

### Frontend Authorization
```typescript
// Component example
const InventoryCreateButton = () => {
  const { hasPermission } = useAuth();
  
  if (!hasPermission('inventory', 'create')) {
    return null;
  }
  
  return <button onClick={handleCreate}>Create Item</button>;
};
```

## Audit Trail

All role and permission changes are logged:

```json
{
  "timestamp": "2026-06-02T12:34:56Z",
  "action": "role_assigned",
  "user_id": "admin-uuid",
  "target_user_id": "operator-uuid",
  "role_id": "warehouse_operator",
  "changes": {
    "previous_roles": ["sales_operator"],
    "new_roles": ["sales_operator", "warehouse_operator"]
  }
}
```

---

Last updated: June 2, 2026
