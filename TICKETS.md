# Development Tickets: Kanban Board Application

## Ticket Overview

This document breaks down the Kanban board application into manageable, atomic tickets that can be developed in parallel by frontend [JAZ] and backend [MARK] developers. Tickets are ordered by dependency to ensure efficient development flow.

---

## Phase 1: Foundation Setup

### Ticket 1: Project Structure & Dependencies
**Assignee**: [MARK]  
**Dependencies**: None  
**Priority**: Critical

**Description**: Set up the basic project structure and install required dependencies for both frontend and backend.

**Deliverables**:
- Create `/client` and `/server` directory structure
- Initialize `package.json` with required dependencies:
  - express, cors, pg, dotenv, nodemon (backend)
- Create `.env.example` file with required environment variables
- Create basic `package.json` scripts for development

**Definition of Done**:
- [ ] Directory structure matches architecture specification
- [ ] All dependencies installed and working
- [ ] `npm run dev` command available but not necessarily functional yet
- [ ] Environment configuration documented

---

### Ticket 2: Database Schema & Connection
**Assignee**: [MARK]  
**Dependencies**: Ticket 1  
**Priority**: Critical

**Description**: Create PostgreSQL database schema and establish connection setup.

**Deliverables**:
- Create `server/db/schema.sql` with tasks table definition
- Create `server/db/connection.js` with PostgreSQL connection pool
- Include proper indexes and constraints as per architecture spec

**Definition of Done**:
- [ ] Tasks table created with all required fields (id, title, description, status, ai_advice, ai_advice_timestamp, created_at, updated_at)
- [ ] Database connection pool configured with environment variables
- [ ] Connection can be established successfully
- [ ] Index on status column created

---

### Ticket 3: Basic HTML Structure & CSS Grid
**Assignee**: [JAZ]  
**Dependencies**: Ticket 1  
**Priority**: Critical

**Description**: Create the basic HTML page and CSS layout for the three-column Kanban board.

**Deliverables**:
- Create `client/index.html` with semantic HTML structure
- Create `client/styles/main.css` with three-column grid layout
- Include placeholder content for To Do, Doing, Done columns
- Implement responsive design with CSS Grid/Flexbox

**Definition of Done**:
- [ ] Single HTML page with proper semantic structure
- [ ] Three-column layout using CSS Grid
- [ ] Columns clearly labeled (To Do, Doing, Done)
- [ ] Basic styling following design requirements
- [ ] Responsive layout that works on desktop browsers

---

## Phase 2: Core Backend API

### Ticket 4: Express Server & Static File Serving
**Assignee**: [MARK]  
**Dependencies**: Tickets 1, 2  
**Priority**: High

**Description**: Set up Express server with middleware and static file serving for the client.

**Deliverables**:
- Create `server/app.js` with Express setup
- Configure CORS, JSON parsing middleware
- Set up static file serving from `/client` directory
- Create basic server startup and error handling

**Definition of Done**:
- [ ] Express server starts on configured port
- [ ] Static files served from client directory
- [ ] CORS configured for frontend access
- [ ] JSON parsing middleware enabled
- [ ] Basic error handling implemented

---

### Ticket 5: Tasks CRUD API Endpoints
**Assignee**: [MARK]  
**Dependencies**: Tickets 2, 4  
**Priority**: High

**Description**: Implement RESTful API endpoints for task management (Create, Read, Update, Delete).

**Deliverables**:
- Create `server/routes/tasks.js` with all CRUD endpoints
- Implement GET, POST, PUT, DELETE, PATCH operations
- Use parameterized SQL queries for security
- Follow RESTful conventions as per architecture spec

**Definition of Done**:
- [ ] GET `/api/tasks` - Returns all tasks
- [ ] POST `/api/tasks` - Creates new task
- [ ] PUT `/api/tasks/:id` - Updates existing task
- [ ] DELETE `/api/tasks/:id` - Deletes task
- [ ] PATCH `/api/tasks/:id/status` - Updates task status only
- [ ] All endpoints use parameterized queries
- [ ] Proper error handling and status codes
- [ ] Response format matches architecture specification

---

## Phase 3: Frontend API Integration

### Ticket 6: ApiClient Class
**Assignee**: [JAZ]  
**Dependencies**: Ticket 5  
**Priority**: High

**Description**: Create centralized API client for communication with backend endpoints.

**Deliverables**:
- Create `client/scripts/ApiClient.js` with all HTTP methods
- Implement async/await patterns for API calls
- Add error handling and response parsing
- Follow naming conventions from CLAUDE.md

**Definition of Done**:
- [ ] Static class with methods for all CRUD operations
- [ ] getTasks(), createTask(), updateTask(), deleteTask(), updateTaskStatus() methods
- [ ] Consistent error handling across all methods
- [ ] Async/await pattern used throughout
- [ ] Proper HTTP status code handling

---

### Ticket 7: TaskCard Component Class
**Assignee**: [JAZ]  
**Dependencies**: Ticket 6  
**Priority**: High

**Description**: Create TaskCard class for rendering and managing individual task cards.

**Deliverables**:
- Create `client/scripts/TaskCard.js` with ES6 class
- Implement task rendering with all UI elements
- Add inline editing functionality for title and description
- Include status change buttons and delete functionality
- Placeholder for AI advice section (without functionality yet)

**Definition of Done**:
- [ ] TaskCard class with constructor accepting task object
- [ ] render() method returns complete task card HTML
- [ ] Inline editing for title and description
- [ ] Status change buttons (To Do → Doing → Done)
- [ ] Delete button functionality
- [ ] Event handling for all user interactions
- [ ] CSS classes follow kebab-case convention
- [ ] Placeholder AI advice section in UI

---

## Phase 4: Core Application Logic

### Ticket 8: Board Management Class
**Assignee**: [JAZ]  
**Dependencies**: Ticket 7  
**Priority**: High

**Description**: Create Board class to manage the overall Kanban board state and task organization.

**Deliverables**:
- Create `client/scripts/Board.js` with ES6 class
- Implement task loading and rendering across columns
- Handle task movement between columns
- Manage board state and UI updates

**Definition of Done**:
- [ ] Board class with constructor accepting container ID
- [ ] loadTasks() method fetches and displays all tasks
- [ ] renderBoard() method organizes tasks by status
- [ ] addTaskToColumn() method handles new task placement
- [ ] moveTask() method handles status changes
- [ ] Integration with TaskCard and ApiClient classes
- [ ] Event delegation for performance

---

### Ticket 9: TaskForm Component Class
**Assignee**: [JAZ]  
**Dependencies**: Ticket 8  
**Priority**: High

**Description**: Create TaskForm class for adding new tasks to the board.

**Deliverables**:
- Create `client/scripts/TaskForm.js` with ES6 class
- Implement form rendering and validation
- Handle form submission and API integration
- Clear form after successful submission

**Definition of Done**:
- [ ] TaskForm class with constructor
- [ ] render() method creates form HTML
- [ ] Form validation for required fields
- [ ] handleSubmit() method processes form data
- [ ] Integration with ApiClient for task creation
- [ ] Form clearing after successful submission
- [ ] Error handling for failed submissions

---

### Ticket 10: Main Application Entry Point
**Assignee**: [JAZ]  
**Dependencies**: Ticket 9  
**Priority**: High

**Description**: Create main application file that initializes and coordinates all components.

**Deliverables**:
- Create `client/scripts/main.js` as application entry point
- Initialize Board, TaskForm, and coordinate components
- Set up event delegation and application lifecycle
- Handle application startup and error states

**Definition of Done**:
- [ ] Application initializes on page load
- [ ] All components properly instantiated
- [ ] Event delegation set up from main container
- [ ] Error handling for initialization failures
- [ ] Board loads and displays existing tasks
- [ ] Task creation form functional
- [ ] Task CRUD operations working end-to-end

---

## Phase 5: AI Integration

### Ticket 11: AI Service Implementation
**Assignee**: [MARK]  
**Dependencies**: Ticket 5  
**Priority**: Medium

**Description**: Implement AI service for generating task advice using OpenAI API.

**Deliverables**:
- Create `server/services/aiService.js` with OpenAI integration
- Implement comprehensive prompt engineering for task analysis
- Add error handling for API failures and rate limits
- Create endpoint for AI advice generation

**Definition of Done**:
- [ ] AiService class with OpenAI API integration
- [ ] generateTaskAdvice() method with comprehensive prompts
- [ ] Error handling for API timeouts, rate limits, network failures
- [ ] POST `/api/tasks/:id/advice` endpoint implemented
- [ ] Generated advice stored in database with timestamp
- [ ] Environment variable configuration for API key

---

### Ticket 12: Frontend AI Advice Integration
**Assignee**: [JAZ]  
**Dependencies**: Tickets 10, 11  
**Priority**: Medium

**Description**: Add AI advice functionality to TaskCard component and enhance UI.

**Deliverables**:
- Update TaskCard class with AI advice display and interaction
- Add "Get AI Advice" button and expandable advice section
- Implement loading states and error handling for AI requests
- Update ApiClient with AI advice methods

**Definition of Done**:
- [ ] "Get AI Advice" button on each task card
- [ ] requestAiAdvice() method in TaskCard class
- [ ] displayAiAdvice() method with expandable UI
- [ ] Loading indicator during AI generation
- [ ] Error messaging for failed AI requests
- [ ] generateAiAdvice() method in ApiClient class
- [ ] Advice persists and displays on page refresh
- [ ] "Regenerate Advice" functionality for updated tasks

---

## Phase 6: Polish & Integration

### Ticket 13: Enhanced Styling & UX
**Assignee**: [JAZ]  
**Dependencies**: Ticket 12  
**Priority**: Low

**Description**: Polish the UI with enhanced styling, animations, and user experience improvements.

**Deliverables**:
- Enhance CSS with hover effects, transitions, and visual feedback
- Improve form styling and validation feedback
- Add loading states and success/error messaging
- Refine responsive design and accessibility

**Definition of Done**:
- [ ] Smooth transitions for task movements and interactions
- [ ] Hover effects and visual feedback for buttons
- [ ] Loading spinners for AI advice generation
- [ ] Success/error toast messages for user actions
- [ ] Improved form styling with clear validation states
- [ ] Accessible design with proper ARIA labels
- [ ] Mobile-friendly responsive design

---

### Ticket 14: End-to-End Testing & Documentation
**Assignee**: [MARK] & [JAZ]  
**Dependencies**: Ticket 13  
**Priority**: Medium

**Description**: Comprehensive testing of all features and creation of setup documentation.

**Deliverables**:
- Manual testing of all CRUD operations
- AI advice generation testing with various task types
- Error handling verification
- Update README.md with setup and usage instructions

**Definition of Done**:
- [ ] All task CRUD operations tested and working
- [ ] AI advice generation tested with multiple scenarios
- [ ] Error handling tested for API failures
- [ ] Database operations verified
- [ ] Cross-browser testing completed
- [ ] README.md updated with complete setup instructions
- [ ] Environment setup guide documented
- [ ] Known issues and limitations documented

---

## Dependency Matrix

| Ticket | Depends On | Can Work In Parallel With |
|--------|------------|---------------------------|
| 1 | None | None |
| 2 | 1 | 3 |
| 3 | 1 | 2 |
| 4 | 1, 2 | 3 |
| 5 | 2, 4 | 3, 6 |
| 6 | 5 | 7 (partial) |
| 7 | 6 | 8 (after completion) |
| 8 | 7 | 9 (after completion) |
| 9 | 8 | 10 (after completion) |
| 10 | 9 | 11 |
| 11 | 5 | 10, 12 (partial) |
| 12 | 10, 11 | 13 (after completion) |
| 13 | 12 | 14 (partial) |
| 14 | 13 | None |

## Development Timeline Recommendation

### Sprint 1 (Parallel Development):
- [MARK]: Tickets 1, 2, 4
- [JAZ]: Ticket 3 (after Ticket 1)

### Sprint 2 (Sequential with Some Parallel):
- [MARK]: Ticket 5
- [JAZ]: Tickets 6, 7 (after Ticket 5)

### Sprint 3 (Primarily Frontend):
- [MARK]: Begin Ticket 11
- [JAZ]: Tickets 8, 9, 10

### Sprint 4 (AI Integration):
- [MARK]: Complete Ticket 11
- [JAZ]: Ticket 12

### Sprint 5 (Polish & Testing):
- [JAZ]: Ticket 13
- [MARK] & [JAZ]: Ticket 14 (collaborative)

## Notes for Developers

- **Environment Setup**: Ensure PostgreSQL is installed and running before starting Ticket 2
- **API Key**: OpenAI API key required for Ticket 11 - keep costs minimal for workshop
- **Testing**: Test each ticket thoroughly before marking complete
- **Communication**: Sync regularly during Sprints 2-3 where tickets have dependencies
- **Standards**: Reference CLAUDE.md for all naming conventions and patterns