# Galewela Pubudu Sweets ERP System

A comprehensive web-based Enterprise Resource Planning (ERP) system designed specifically for food manufacturing, with emphasis on lot traceability, quality control, and compliance.

## 🎯 Project Overview

This ERP system manages all critical operations for a sweets manufacturing company:
- **Inventory & Warehouse Management** - Lot/batch tracking with expiry dates, FEFO picking
- **Production & BOM/Recipe Management** - Multi-level recipes, batch production, yield tracking
- **Quality Control & Compliance** - Inspections, non-conformance, CAPA workflows
- **Traceability & Recall** - Complete forward/backward lot genealogy
- **Costing & Accounting** - Multiple costing methods, GL integration
- **Sales, CRM & Order Management** - Quotes, orders, pricing, customer management
- **Purchasing & Supplier Management** - POs, receipts, vendor evaluation
- **Packaging & Labeling** - Dynamic label generation with batch data
- **Reporting & Business Intelligence** - KPI dashboards and compliance reports

## 📅 Development Timeline

**MVP (6-9 months):** ~$100K-$200K
- Core module implementation
- Essential features only
- Pilot deployment

**Full Rollout (12-18 months):** ~$300K-$400K
- Advanced features
- Complete integration suite
- Production deployment

See [ROADMAP.md](./ROADMAP.md) for detailed timeline and milestones.

## 🏗️ Architecture

- **Frontend:** React with TypeScript, responsive design
- **Backend:** Node.js/Express or Python/Flask (REST & GraphQL APIs)
- **Database:** PostgreSQL (transactional), Redis (caching/sessions)
- **Auth:** OAuth2/JWT with role-based access control
- **Hosting:** Cloud-native (AWS/Azure/GCP), containerized (Docker/Kubernetes)
- **CI/CD:** GitHub Actions for automated builds and deployments

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed technical design.

## 📦 Project Structure

```
galewela-erp/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── api/            # API routes and controllers
│   │   ├── models/         # Data models and schemas
│   │   ├── middleware/     # Authentication, validation, etc.
│   │   ├── services/       # Business logic
│   │   └── config/         # Configuration files
│   ├── tests/              # Unit and integration tests
│   ├── migrations/         # Database migration scripts
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client services
│   │   ├── store/          # State management
│   │   └── styles/         # Styles and themes
│   ├── public/             # Static assets
│   └── package.json
├── database/               # Database schemas and migrations
│   ├── schema.sql
│   └── seeds/
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md
│   ├── API_SPECIFICATION.md
│   ├── DATABASE_SCHEMA.md
│   └── USER_ROLES.md
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── docker-compose.yml      # Local development environment
├── ROADMAP.md              # Development roadmap and milestones
└── REQUIREMENTS.md         # Full requirements document
```

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Docker & Docker Compose (optional)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/buntyblitz/galewela-erp.git
   cd galewela-erp
   ```

2. **Start development environment**
   ```bash
   docker-compose up -d
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

4. **Run database migrations**
   ```bash
   cd ../backend
   npm run migrate
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Backend
   npm run dev
   
   # Terminal 2: Frontend
   cd ../frontend && npm start
   ```

Access the application at `http://localhost:3000`

## 📚 Documentation

- [Requirements Document](./REQUIREMENTS.md) - Complete functional and technical requirements
- [Architecture Guide](./docs/ARCHITECTURE.md) - System design and technical decisions
- [API Specification](./docs/API_SPECIFICATION.md) - REST API endpoints and schemas
- [Database Schema](./docs/DATABASE_SCHEMA.md) - Entity-relationship diagrams and table definitions
- [User Roles & Permissions](./docs/USER_ROLES.md) - RBAC implementation guide
- [Development Guide](./docs/DEVELOPMENT.md) - Contributing and development workflow
- [Roadmap](./ROADMAP.md) - Milestones and feature phases

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- src/api/inventory.test.ts
```

## 🔌 Integration Points

- **Accounting:** QuickBooks, Xero, SAP
- **E-Commerce:** Shopify, Amazon, WooCommerce
- **POS Systems:** Square, Lightspeed
- **Payments:** Stripe, PayPal
- **Payroll/HR:** Gusto, ADP
- **IoT:** Temperature/humidity sensors, cold chain monitoring

## 📋 Core Features

### MVP Essentials
- [x] Inventory tracking (raw, WIP, finished goods) with lots
- [x] FEFO/FIFO picking rules
- [x] Recipe/BOM management with versioning
- [x] Production orders and batch processing
- [x] Quality inspections and CAPA workflows
- [x] Forward/backward traceability
- [x] Sales and purchase order management
- [x] Basic cost methods (FIFO, Standard)
- [x] Barcode/QR scanning
- [x] Role-based access control
- [x] Essential reports and dashboards

### Optional (Phase 2+)
- [ ] Advanced finite scheduling (AI-powered)
- [ ] Sophisticated QC analytics and LIMS integration
- [ ] Weighted average and landed cost costing
- [ ] Advanced CRM and pricing rules
- [ ] Supplier scorecards and ratings
- [ ] Offline mobile apps
- [ ] Catch-weight management
- [ ] MFA and SSO integration
- [ ] Advanced BI and predictive analytics
- [ ] CMMS (maintenance management)
- [ ] Full HR/Payroll integration
- [ ] PLM (product lifecycle management)

## 👥 Team Roles

- **Project Manager** - Scheduling and coordination
- **Business Analyst** - Food manufacturing domain expertise
- **Solution Architect** - System design and technical decisions
- **UI/UX Designer** - User interface and experience
- **Frontend Developer(s)** - React components and UI logic
- **Backend Developer(s)** - APIs, business logic, data processing
- **QA Engineer(s)** - Testing and quality assurance
- **DevOps Engineer** - Infrastructure, CI/CD, monitoring
- *Optional:* Data Analyst, Compliance Officer

## 📊 Cost & Timeline Estimates

| Phase | Duration | Cost | Deliverables |
|-------|----------|------|--------------|
| Planning & Design | 1-2 months | $15K-$30K | Requirements, design docs, UI mockups |
| MVP Development | 4-7 months | $80K-$150K | Core modules, integration testing |
| Testing & QA | 1-2 months | $20K-$30K | UAT, bug fixes, performance tuning |
| Pilot & Refinement | 2-3 months | $30K-$50K | Pilot deployment, feedback iteration |
| **Full Rollout** | 6-12 months | $300K-$400K total | Advanced features, full deployment |

## 🔒 Security & Compliance

- HTTPS/TLS encryption for all communications
- JWT-based authentication and OAuth2 integration
- Role-Based Access Control (RBAC) with least privilege principle
- Encrypted data at rest (DB encryption)
- Comprehensive audit logging of all actions
- GDPR/CCPA compliance for customer data
- OWASP best practices implementation
- Regular security audits and penetration testing
- Nightly database backups with off-site replication

## 🤝 Contributing

Please see [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for contribution guidelines and development workflow.

## 📞 Support

For issues, feature requests, or questions:
- Open a GitHub Issue
- Check existing documentation
- Review project roadmap for planned features

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built for Galewela Pubudu Sweets with comprehensive food manufacturing requirements including lot traceability, quality compliance, and regulatory adherence.

---

**Last Updated:** June 2, 2026  
**Current Phase:** Planning & Requirements  
**Status:** Active Development
