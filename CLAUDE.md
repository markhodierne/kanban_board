**IMPORTANT FOR CLAUDE: Reference this file before implementing anything**

# Project: Kanban Board Application

## Project Overview

A collaborative Kanban board web application for managing tasks across three workflow stages (To Do, Doing, Done) with AI-powered task guidance. Built with vanilla JavaScript frontend, Node.js/Express backend, PostgreSQL database, and OpenAI API integration for comprehensive task advice generation.

## Tech Stack

- Languages: JavaScript (ES6+), SQL
- Frontend: Vanilla JavaScript, Plain CSS, HTML5
- Backend: Node.js, Express.js
- Database: PostgreSQL with raw SQL queries
- External APIs: OpenAI API for task advice generation
- Package Manager: npm
- Tools: Git, VS Code, PostgreSQL client

## Code Style & Conventions

### Import/Module Standards

- Use ES6 modules for frontend: `import/export` syntax
- Use CommonJS for backend: `require()` and `module.exports`
- No default exports - use named exports for clarity
- Import external libraries before internal modules
- Group imports: external libraries, then internal modules

### Naming Conventions

- **Functions**: camelCase with descriptive verbs - `createTaskCard()`, `updateTaskStatus()`, `generateAiAdvice()`
- **Classes/Components**: PascalCase with descriptive nouns - `TaskCard`, `TaskForm`, `ApiClient`, `AiService`
- **Constants**: UPPER_SNAKE_CASE - `API_BASE_URL`, `TASK_STATUS_OPTIONS`, `AI_ADVICE_PROMPT`
- **Variables**: camelCase with descriptive nouns - `taskBoard`, `aiAdviceText`, `statusUpdateButton`
- **CSS Classes**: kebab-case with descriptive names - `task-card`, `ai-advice-section`, `status-button`
- **Files**: camelCase for JS files, kebab-case for others - `TaskCard.js`, `aiService.js`, `main.css`
- **Database**: snake_case for tables and columns - `tasks`, `ai_advice`, `created_at`

### Patterns to Follow

- **ES6 Classes**: Use class syntax for components and services
- **Async/Await**: Prefer async/await over Promises for cleaner code
- **Event Delegation**: Use event delegation from main containers for performance
- **Error Handling**: Simple console.error() for development, basic user feedback
- **API Communication**: Centralized in ApiClient class with consistent error handling
- **Database Queries**: Parameterized queries to prevent SQL injection
- **Environment Configuration**: Use process.env for sensitive data like API keys
- **CSS Architecture**: Use CSS custom properties for theming, shared base classes to reduce repetition
- **DRY Principles**: Extract common patterns into reusable classes (e.g., `.btn` for buttons)

## Development Workflow

- **Branch Strategy**: main + dev branches, feature branches for major changes
- **Commit Message Format**: Conventional commits - `feat:`, `fix:`, `docs:`, `refactor:`
- **PR Requirements**: Working code, basic testing, follows naming conventions

## Testing Strategy

- **Test Framework**: No formal testing framework for workshop scope
- **Testing Approach**: Manual browser testing and console verification
- **Coverage Requirements**: Test all CRUD operations and AI advice generation manually

## Environment Setup

- **Required Environment Variables**:
  - `OPENAI_API_KEY` - OpenAI API key for advice generation
  - `DB_USER` - PostgreSQL username (default: postgres)
  - `DB_PASSWORD` - PostgreSQL password
  - `DB_HOST` - Database host (default: localhost)
  - `DB_PORT` - Database port (default: 5432)
  - `DB_NAME` - Database name (default: kanban_board)
  - `PORT` - Server port (default: 3000)

- **Setup Commands**:
```bash
npm install
createdb kanban_board
psql kanban_board < server/db/schema.sql
```

- **Local Development Server**: `npm run dev`

## Common Commands

```bash
# Development server with auto-restart
npm run dev

# Start production server
npm start

# Database setup
npm run db:setup

# Database reset
npm run db:reset

# Check dependencies
npm audit

# Install new dependency
npm install [package-name]
```

## Project Structure

Key directories and their purpose:

- `/client` - Frontend application (HTML, CSS, JavaScript modules)
- `/server` - Backend Express application with routes and services
- `/server/db` - Database connection, schema, and SQL queries
- `/server/routes` - Express route handlers for API endpoints
- `/server/services` - External API integrations (AI service)

## Review Process Guidelines

Before submitting any code, ensure the following steps are completed:

1. **Run all commands and verify functionality**:
   - Server starts without errors
   - Database connections work
   - Frontend loads and displays correctly
   - All CRUD operations function
   - AI advice generation works

2. **Assess compliance**:
   For each standard, explicitly state ✅ or ❌ and explain why:

   - **Code Style**: camelCase functions, PascalCase classes, kebab-case CSS
   - **Naming Conventions**: Descriptive function names, clear variable names
   - **Architecture Patterns**: ES6 classes, async/await, event delegation, CSS custom properties
   - **Error Handling**: Console logging implemented, basic user feedback
   - **API Integration**: OpenAI API properly configured and functional
   - **Database**: Raw SQL queries, parameterized statements, proper schema
   - **CSS Quality**: DRY principles applied, shared base classes, no duplication

3. **Self-review checklist**:
   - [ ] All functions use descriptive, verb-based names
   - [ ] Classes follow PascalCase convention
   - [ ] CSS classes use kebab-case
   - [ ] CSS custom properties used for theming
   - [ ] Shared base classes implemented to reduce repetition
   - [ ] No hardcoded API keys in source code
   - [ ] Database queries use parameterized statements
   - [ ] Error handling implemented for API failures
   - [ ] Event delegation used for UI interactions
   - [ ] Async/await used consistently
   - [ ] AI advice generation works end-to-end
   - [ ] No debug console.log statements left in code

## Specific Implementation Guidelines

### Frontend Development
- Use single HTML page with modular JavaScript classes
- Implement event delegation from main containers
- Use CSS Grid/Flexbox for three-column layout
- Handle loading states for AI advice generation
- Provide visual feedback for user interactions

### Backend Development
- Use Express middleware for JSON parsing and CORS
- Implement RESTful API endpoints following resource-based patterns
- Use raw SQL queries with node-postgres (pg) client
- Handle AI API rate limits and failures gracefully
- Serve static files from client directory

### Database Development
- Use PostgreSQL with snake_case naming
- Create indexes for frequently queried columns
- Use SERIAL for auto-incrementing IDs
- Store AI advice as TEXT with timestamp
- Implement proper foreign key constraints if needed

### AI Integration
- Use OpenAI API with gpt-4o model
- Implement proper prompt engineering for task advice
- Handle API timeouts and rate limits
- Store generated advice in database
- Provide regeneration capability

## Known Issues & Workarounds

- **AI API Rate Limits**: Implement basic rate limiting on frontend to prevent excessive requests
- **Large Task Lists**: No pagination implemented - manual limit for workshop scope
- **Error Handling**: Basic console logging only - enhance for production use
- **Real-time Updates**: No WebSocket - manual refresh needed for multi-user scenarios

## References

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Node.js Guide](https://node-postgres.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)