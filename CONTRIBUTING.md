# Galewela ERP - Contributing Guide

Thank you for your interest in contributing to the Galewela Pubudu Sweets ERP system! This document provides guidelines and instructions for contributing.

## Code of Conduct

All contributors are expected to follow our Code of Conduct. Please treat all team members with respect and professionalism.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Docker & Docker Compose
- Git

### Setup Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/buntyblitz/galewela-erp.git
   cd galewela-erp
   ```

2. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start development services**
   ```bash
   docker-compose up -d
   ```

4. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   npm run migrate
   
   # Frontend
   cd ../frontend
   npm install
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend
   cd frontend
   npm start
   ```

Access the application at `http://localhost:3000`

## Development Workflow

### 1. Create a Feature Branch

Use descriptive branch names following this pattern:
- `feature/inventory-lot-tracking`
- `bugfix/production-yield-calculation`
- `docs/api-specification`

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Follow these guidelines:
- **Commit often:** Make small, logical commits
- **Write clear commit messages:** Use present tense ("Add feature" not "Added feature")
- **Code style:** Follow ESLint/Prettier configuration (runs on commit)
- **Tests:** Write tests for new functionality (target >80% coverage)

### 3. Before Pushing

Run quality checks locally:

```bash
# Backend
cd backend
npm run lint          # Lint check
npm run format        # Auto-format code
npm test              # Run tests
npm run test:cov      # Coverage report

# Frontend
cd frontend
npm run lint
npm run format
npm test:ci
```

### 4. Submit a Pull Request

Create a PR with:
- **Title:** Concise, descriptive (e.g., "Add FIFO inventory picking logic")
- **Description:** Explain what, why, and how
- **Linked Issues:** Reference related issues (#123)
- **Tests:** Confirm tests pass locally
- **Documentation:** Update relevant docs if needed

PR Template:
```markdown
## Description
Brief description of changes

## Related Issues
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe test coverage

## Checklist
- [ ] Tests pass locally
- [ ] Lint passing
- [ ] No new warnings
- [ ] Documentation updated
- [ ] Database schema changes documented
```

### 5. Code Review

- Address reviewer comments promptly
- Keep PR focused (avoid mixing multiple features)
- Request reviews from maintainers
- Merge only after approval and CI passing

## Coding Standards

### Backend (Node.js/TypeScript)

```typescript
// Use TypeScript for type safety
interface Item {
  id: string;
  name: string;
  type: 'raw_material' | 'finished_good';
}

// Use async/await
async function getItem(id: string): Promise<Item> {
  return await ItemService.findById(id);
}

// Error handling
try {
  const item = await getItem(id);
  res.json(item);
} catch (error) {
  logger.error('Error fetching item', { error, id });
  res.status(500).json({ error: 'Internal Server Error' });
}

// Validation
const schema = z.object({
  name: z.string().min(1),
  type: z.enum(['raw_material', 'finished_good']),
});
```

### Frontend (React/TypeScript)

```typescript
// Use functional components
interface ItemListProps {
  items: Item[];
  onSelect: (item: Item) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onSelect }) => {
  return (
    <div className="item-list">
      {items.map(item => (
        <button key={item.id} onClick={() => onSelect(item)}>
          {item.name}
        </button>
      ))}
    </div>
  );
};

// Use hooks
const [items, setItems] = useState<Item[]>([]);

useEffect(() => {
  fetchItems().then(setItems);
}, []);

// Error boundaries
<ErrorBoundary>
  <ItemList items={items} onSelect={handleSelect} />
</ErrorBoundary>
```

## Testing Guidelines

### Backend Tests
- **Unit tests:** Test individual functions/services
- **Integration tests:** Test API endpoints with database
- **Mocking:** Mock external dependencies

```typescript
describe('InventoryService', () => {
  it('should deduct stock from lot', async () => {
    const lot = await createTestLot();
    const result = await InventoryService.deductStock(lot.id, 10);
    
    expect(result.quantityAvailable).toBe(lot.quantityAvailable - 10);
  });
});
```

### Frontend Tests
- **Component tests:** Test UI behavior with React Testing Library
- **Snapshot tests:** For stable UI components
- **Integration tests:** Test user workflows

```typescript
describe('ItemForm', () => {
  it('should submit form with valid data', async () => {
    render(<ItemForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Sugar' }
    });
    fireEvent.click(screen.getByText('Submit'));
    
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Sugar' })
    );
  });
});
```

## Documentation

### Code Comments
```typescript
/**
 * Calculate FIFO cost for a stock movement
 * @param lot - The lot to calculate cost for
 * @param quantity - Quantity being moved
 * @returns Calculated cost based on FIFO method
 */
function calculateFIFOCost(lot: Lot, quantity: number): number {
  // Implementation
}
```

### Documentation Files
- Update relevant `.md` files in `/docs`
- For API changes: update `docs/API_SPECIFICATION.md`
- For database changes: update `docs/DATABASE_SCHEMA.md`

## Database Migrations

For schema changes:

1. **Create migration**
   ```bash
   npm run migrate:create -- --name add_allergen_tracking
   ```

2. **Write migration**
   ```sql
   -- Add allergen tracking table
   CREATE TABLE allergen_tracking (
     id UUID PRIMARY KEY,
     item_id UUID NOT NULL,
     allergen VARCHAR(100) NOT NULL,
     FOREIGN KEY (item_id) REFERENCES items(id)
   );
   ```

3. **Test migration**
   ```bash
   npm run migrate
   npm run migrate:rollback  # Test rollback
   npm run migrate           # Reapply
   ```

## Issues & Bug Reports

When creating issues:
- **Search first:** Check if issue already exists
- **Be specific:** Include steps to reproduce
- **Provide context:** Environment, version, logs
- **Use templates:** Select appropriate template

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
```
feat(inventory): add FEFO picking algorithm

Implement FIFO/FEFO inventory picking for raw materials
based on expiration dates. Addresses issue #45.

Closes #45
```

```
fix(production): correct yield calculation formula

The waste calculation was not accounting for partial
yields. Fixed formula to include all waste types.
```

## Performance Considerations

- **Database queries:** Use indexes, avoid N+1 problems
- **API responses:** Use pagination for large datasets
- **Frontend:** Use React.memo, useMemo for expensive computations
- **Caching:** Implement Redis caching for frequently accessed data

## Security Best Practices

- **Input validation:** Always validate user input
- **SQL injection:** Use parameterized queries (ORM handles this)
- **XSS prevention:** Sanitize user data, use libraries like DOMPurify
- **Authentication:** Don't expose sensitive data in responses
- **Secrets:** Never commit API keys, use environment variables

## Deployment

### Staging Deployment
Merging to `develop` triggers automatic deployment to staging

### Production Deployment
Create a release PR to `main` and request reviews

## Getting Help

- **Documentation:** Check `/docs` folder
- **Issues:** Search existing GitHub issues
- **Discussions:** Use GitHub Discussions for questions
- **Slack/Email:** Contact team leads

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Galewela Pubudu Sweets ERP!** 🎉
