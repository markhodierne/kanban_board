# Architectural Specification: Kanban Board Application

## System Architecture Overview

A simple full-stack web application using a client-server architecture with clear separation of concerns. The system consists of a vanilla JavaScript frontend, Node.js/Express backend, PostgreSQL database, and external AI API integration.

## Technology Stack

### Frontend
- **Language**: Vanilla JavaScript (ES6+)
- **Styling**: Plain CSS
- **Architecture**: Single HTML page with modular JavaScript components
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Architecture**: Simple Express structure with direct route handlers
- **Database**: Raw SQL queries to PostgreSQL

### Database
- **Type**: PostgreSQL (relational database)
- **Access**: Direct SQL queries via node-postgres (pg) client
- **Schema**: Single tasks table with AI advice field

### External Services
- **AI Provider**: OpenAI API (or similar)
- **Purpose**: Generate comprehensive task guidance on-demand

## Project Structure

```
kanban_board/
├── client/                 # Frontend application
│   ├── index.html         # Main HTML page
│   ├── styles/
│   │   └── main.css       # Application styles
│   └── scripts/
│       ├── main.js        # Application entry point
│       ├── Board.js       # Board management class
│       ├── TaskCard.js    # Task card component class
│       ├── TaskForm.js    # Task form handling class
│       └── ApiClient.js   # Backend API communication class
├── server/                # Backend application
│   ├── app.js            # Express application setup
│   ├── routes/
│   │   └── tasks.js      # Task-related API routes
│   ├── db/
│   │   ├── connection.js # Database connection setup
│   │   └── schema.sql    # Database table definitions
│   └── services/
│       └── aiService.js  # External AI API integration
├── package.json          # Node.js dependencies
└── README.md            # Setup and usage instructions
```

## Database Design

### Tasks Table Schema
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'todo',
    ai_advice TEXT,
    ai_advice_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_status ON tasks(status);
```

### Data Flow
- **Task Status Values**: 'todo', 'doing', 'done'
- **AI Advice**: Generated on-demand, stored as text
- **Timestamps**: Track creation and AI advice generation times

## API Design

### RESTful Endpoints

#### Tasks Resource
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status only

#### AI Advice
- `POST /api/tasks/:id/advice` - Generate AI advice for specific task

### Request/Response Examples

#### Get All Tasks
```javascript
GET /api/tasks
Response: {
  success: true,
  data: [
    {
      id: 1,
      title: "Implement user authentication",
      description: "Add login and signup functionality",
      status: "todo",
      ai_advice: "Consider using JWT tokens...",
      ai_advice_timestamp: "2024-01-15T10:30:00Z",
      created_at: "2024-01-15T09:00:00Z"
    }
  ]
}
```

#### Generate AI Advice
```javascript
POST /api/tasks/1/advice
Request: { task_id: 1 }
Response: {
  success: true,
  data: {
    advice: "For implementing user authentication, consider these approaches...",
    generated_at: "2024-01-15T10:30:00Z"
  }
}
```

## Frontend Architecture

### Component Structure

#### Main Application (main.js)
- Application initialization
- Event delegation setup
- Component coordination

#### Board Class
```javascript
class Board {
  constructor(containerId)
  loadTasks()
  renderBoard()
  addTaskToColumn(task, columnId)
  moveTask(taskId, newStatus)
}
```

#### TaskCard Class
```javascript
class TaskCard {
  constructor(task)
  render()
  enableInlineEditing()
  handleStatusChange()
  requestAiAdvice()
  displayAiAdvice(advice)
}
```

#### TaskForm Class
```javascript
class TaskForm {
  constructor(containerId)
  render()
  handleSubmit()
  validateInput()
  clearForm()
}
```

#### ApiClient Class
```javascript
class ApiClient {
  static async getTasks()
  static async createTask(taskData)
  static async updateTask(id, taskData)
  static async deleteTask(id)
  static async updateTaskStatus(id, status)
  static async generateAiAdvice(id)
}
```

### Event Handling
- Event delegation from main container
- Class-based event handling within components
- API calls with async/await pattern

## Backend Architecture

### Express Application Structure

#### Application Setup (app.js)
```javascript
const express = require('express')
const cors = require('cors')
const taskRoutes = require('./routes/tasks')

const app = express()
app.use(express.json())
app.use(cors())
app.use('/api/tasks', taskRoutes)
app.use(express.static('../client'))
```

#### Task Routes (routes/tasks.js)
```javascript
const express = require('express')
const db = require('../db/connection')
const aiService = require('../services/aiService')

router.get('/', getAllTasks)
router.post('/', createTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)
router.patch('/:id/status', updateTaskStatus)
router.post('/:id/advice', generateTaskAdvice)
```

### Database Integration

#### Connection Management (db/connection.js)
```javascript
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kanban_board',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}
```

#### SQL Query Examples
```javascript
// Get all tasks
const getAllTasks = async () => {
  const result = await db.query(
    'SELECT * FROM tasks ORDER BY created_at DESC'
  )
  return result.rows
}

// Create task
const createTask = async (title, description) => {
  const result = await db.query(
    'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
    [title, description]
  )
  return result.rows[0]
}
```

## AI Service Integration

### Service Architecture (services/aiService.js)
```javascript
const OpenAI = require('openai')

class AiService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  async generateTaskAdvice(title, description) {
    const prompt = `Analyze this task and provide comprehensive guidance:
    Title: ${title}
    Description: ${description}
    
    Provide advice covering:
    1. Risk management and potential blockers
    2. Best practices and optimization tips
    3. Implementation suggestions and efficient approaches`
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300
    })
    
    return response.choices[0].message.content
  }
}
```

### Error Handling
- API rate limit handling
- Network failure graceful degradation
- User-friendly error messages
- Fallback behavior when AI service unavailable

## Data Flow Architecture

### Task Creation Flow
1. User fills task form in frontend
2. TaskForm validates input
3. ApiClient sends POST to `/api/tasks`
4. Express route handler processes request
5. SQL INSERT query creates task in database
6. Response sent back to frontend
7. Board updates UI with new task

### AI Advice Generation Flow
1. User clicks "Get AI Advice" button
2. TaskCard initiates advice request
3. ApiClient sends POST to `/api/tasks/:id/advice`
4. Express route retrieves task details from database
5. AI service sends request to OpenAI API
6. Generated advice stored in database
7. Response sent back to frontend
8. TaskCard displays advice in UI

### Status Update Flow
1. User clicks status change button
2. TaskCard handles status change event
3. ApiClient sends PATCH to `/api/tasks/:id/status`
4. Express route updates task status in database
5. Frontend Board moves task to appropriate column

## Development Workflow

### Environment Setup
- Node.js and npm installation
- PostgreSQL database setup
- Environment variable configuration
- OpenAI API key setup

### Development Server
- Express serves static files from client directory
- Hot reload for frontend changes
- Nodemon for backend development
- Database connection testing

### Build Process
- No build step required for vanilla JavaScript
- Direct file serving from Express
- Environment-specific configuration

## Scalability Considerations

### Current Limitations
- Single database connection pool
- No caching layer
- Synchronous AI API calls
- No pagination for large task lists

### Future Improvements
- Connection pooling optimization
- Redis caching for AI responses
- Async task processing for AI generation
- Pagination and filtering
- WebSocket for real-time updates

## Security Considerations

### API Security
- Environment variable for API keys
- Input validation for all endpoints
- SQL injection prevention with parameterized queries
- CORS configuration for client access

### Data Protection
- No sensitive data sent to AI service
- Minimal data exposure in API responses
- Basic input sanitization

## Performance Considerations

### Frontend Optimization
- Minimal DOM manipulation
- Event delegation for performance
- Lazy loading of AI advice
- CSS for visual feedback during API calls

### Backend Optimization
- Database connection pooling
- Efficient SQL queries with indexes
- Async/await for non-blocking operations
- Error handling to prevent server crashes

### AI Service Optimization
- Request debouncing for advice generation
- Caching of AI responses in database
- Timeout handling for slow API responses
- Rate limit compliance