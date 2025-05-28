// main.js - Main application entry point for Kanban Board
// Initializes and coordinates all components, handles application lifecycle

import { Board } from './Board.js';
import { TaskForm } from './TaskForm.js';

class KanbanApp {
    constructor() {
        this.board = null;
        this.taskForm = null;
        this.isInitialized = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async initialize() {
        try {
            console.log('Initializing Kanban Board Application...');
            
            this.validateDOMStructure();
            this.setupEventDelegation();
            await this.initializeComponents();
            this.setupComponentCommunication();
            
            this.isInitialized = true;
            console.log('Kanban Board Application initialized successfully');
            
            this.showInitializationSuccess();
            
        } catch (error) {
            console.error('Failed to initialize Kanban Board Application:', error);
            this.handleInitializationError(error);
        }
    }

    validateDOMStructure() {
        const requiredElements = [
            { id: 'kanban-board', name: 'Kanban Board Container' },
            { id: 'todo-column', name: 'Todo Column' },
            { id: 'doing-column', name: 'Doing Column' },
            { id: 'done-column', name: 'Done Column' }
        ];

        for (const element of requiredElements) {
            const el = document.getElementById(element.id);
            if (!el) {
                throw new Error(`Missing required DOM element: ${element.name} (ID: ${element.id})`);
            }
        }

        // Create task form container if it doesn't exist
        if (!document.getElementById('task-form-container')) {
            this.createTaskFormContainer();
        }
    }

    createTaskFormContainer() {
        const container = document.createElement('div');
        container.id = 'task-form-container';
        container.className = 'task-form-container';
        
        const kanbanBoard = document.getElementById('kanban-board');
        kanbanBoard.parentNode.insertBefore(container, kanbanBoard);
    }

    setupEventDelegation() {
        // Set up global event delegation from document body
        document.body.addEventListener('taskCreated', (e) => {
            this.handleTaskCreated(e);
        });

        document.body.addEventListener('taskUpdate', (e) => {
            this.handleTaskUpdate(e);
        });

        // Handle page visibility changes for potential data refresh
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle network reconnection
        window.addEventListener('online', () => {
            this.handleNetworkReconnection();
        });

        window.addEventListener('offline', () => {
            this.handleNetworkDisconnection();
        });
    }

    async initializeComponents() {
        try {
            // Initialize Board component
            this.board = new Board('kanban-board');
            console.log('Board component initialized');

            // Initialize TaskForm component
            this.taskForm = new TaskForm('task-form-container');
            console.log('TaskForm component initialized');

            // Load initial data
            await this.board.loadTasks();
            console.log('Initial tasks loaded');

        } catch (error) {
            console.error('Error initializing components:', error);
            throw new Error(`Component initialization failed: ${error.message}`);
        }
    }

    setupComponentCommunication() {
        // Additional component communication logic if needed
        // Components already communicate via custom events
        console.log('Component communication established');
    }

    handleTaskCreated(e) {
        const { task } = e.detail;
        
        if (this.board && task) {
            this.board.addNewTask(task);
            console.log('New task added to board:', task.title);
        }
    }

    handleTaskUpdate(e) {
        // Board component already handles task updates via its own event delegation
        // This is for any additional app-level logic
        const { type, task } = e.detail;
        console.log(`Task ${type}:`, task?.title || 'Unknown task');
    }

    handleVisibilityChange() {
        if (!document.hidden && this.isInitialized) {
            // Page became visible - could refresh data if needed
            console.log('Page became visible - checking for updates');
        }
    }

    handleNetworkReconnection() {
        console.log('Network reconnected');
        
        if (this.isInitialized && this.board) {
            // Refresh data after network reconnection
            this.board.loadTasks().catch(error => {
                console.error('Failed to refresh tasks after reconnection:', error);
            });
        }
    }

    handleNetworkDisconnection() {
        console.log('Network disconnected');
        this.showNetworkError('Network connection lost. Some features may not work properly.');
    }

    async handleInitializationError(error) {
        this.retryCount++;
        
        if (this.retryCount <= this.maxRetries) {
            console.log(`Initialization failed, retrying (${this.retryCount}/${this.maxRetries})...`);
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
            
            try {
                await this.initialize();
                return;
            } catch (retryError) {
                console.error('Retry failed:', retryError);
            }
        }

        // Show error UI
        this.showInitializationError(error);
    }

    showInitializationSuccess() {
        // Remove any existing error messages
        const existingErrors = document.querySelectorAll('.initialization-error, .network-error');
        existingErrors.forEach(error => error.remove());
    }

    showInitializationError(error) {
        const kanbanBoard = document.getElementById('kanban-board');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'initialization-error';
        
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>Failed to Load Kanban Board</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <p>Please check that:</p>
                <ul>
                    <li>The server is running</li>
                    <li>The database is connected</li>
                    <li>Network connection is available</li>
                </ul>
                <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            </div>
        `;
        
        errorDiv.style.cssText = `
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 20px;
            border-radius: 8px;
            margin: 20px auto;
            max-width: 600px;
            text-align: center;
        `;

        // Hide the kanban board on critical errors
        if (kanbanBoard) {
            kanbanBoard.style.display = 'none';
        }

        document.body.insertBefore(errorDiv, kanbanBoard);
    }

    showNetworkError(message) {
        // Remove existing network errors
        const existingError = document.querySelector('.network-error');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'network-error';
        errorDiv.textContent = message;
        
        errorDiv.style.cssText = `
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 12px;
            border-radius: 4px;
            margin: 10px auto;
            max-width: 600px;
            text-align: center;
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
        `;

        document.body.appendChild(errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Public method to get board instance for external access if needed
    getBoard() {
        return this.board;
    }

    // Public method to get task form instance for external access if needed
    getTaskForm() {
        return this.taskForm;
    }

    // Public method to check if app is initialized
    isReady() {
        return this.isInitialized;
    }
}

// Initialize application when DOM is ready
let kanbanApp = null;

async function initializeApp() {
    try {
        kanbanApp = new KanbanApp();
        await kanbanApp.initialize();
        
        // Make app instance available globally for debugging
        window.kanbanApp = kanbanApp;
        
    } catch (error) {
        console.error('Critical application initialization error:', error);
    }
}

// Start the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready
    initializeApp();
}

// Export for potential external access
export { KanbanApp, kanbanApp };