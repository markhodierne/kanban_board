import { ApiClient } from './ApiClient.js';
import { TaskCard } from './TaskCard.js';

export class Board {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with ID '${containerId}' not found`);
        }
        
        this.tasks = [];
        this.columns = {
            'todo': this.container.querySelector('#todo-column .task-list'),
            'doing': this.container.querySelector('#doing-column .task-list'),
            'done': this.container.querySelector('#done-column .task-list')
        };
        
        this.validateColumns();
        this.setupEventDelegation();
    }

    validateColumns() {
        for (const [status, column] of Object.entries(this.columns)) {
            if (!column) {
                throw new Error(`Column for status '${status}' not found`);
            }
        }
    }

    setupEventDelegation() {
        this.container.addEventListener('taskUpdate', (e) => {
            this.handleTaskUpdate(e);
        });
    }

    async loadTasks() {
        try {
            this.tasks = await ApiClient.getTasks();
            this.renderBoard();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showError('Failed to load tasks. Please refresh the page.');
        }
    }

    renderBoard() {
        this.clearAllColumns();
        
        this.tasks.forEach(task => {
            this.addTaskToColumn(task, task.status);
        });
        
        this.updateColumnCounts();
    }

    clearAllColumns() {
        Object.values(this.columns).forEach(column => {
            column.innerHTML = '';
        });
    }

    addTaskToColumn(task, status) {
        const column = this.columns[status];
        if (!column) {
            console.error(`Invalid status: ${status}`);
            return;
        }

        const taskCard = new TaskCard(task);
        const taskElement = taskCard.render();
        
        column.appendChild(taskElement);
    }

    async moveTask(taskId, newStatus) {
        try {
            await ApiClient.updateTaskStatus(taskId, newStatus);
            
            const taskIndex = this.tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex].status = newStatus;
            }
            
            this.renderBoard();
        } catch (error) {
            console.error('Error moving task:', error);
            this.showError('Failed to move task. Please try again.');
        }
    }

    handleTaskUpdate(e) {
        const { type, task, element } = e.detail;
        
        switch (type) {
            case 'status-changed':
                this.handleStatusChange(task, element);
                break;
            case 'deleted':
                this.handleTaskDeletion(task, element);
                break;
            case 'updated':
                this.handleTaskModification(task);
                break;
        }
    }

    handleStatusChange(task, element) {
        element.remove();
        
        const taskIndex = this.tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = task;
        }
        
        this.addTaskToColumn(task, task.status);
        this.updateColumnCounts();
    }

    handleTaskDeletion(task, element) {
        element.remove();
        
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.updateColumnCounts();
    }

    handleTaskModification(task) {
        const taskIndex = this.tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = task;
        }
    }

    addNewTask(task) {
        this.tasks.push(task);
        this.addTaskToColumn(task, task.status || 'todo');
        this.updateColumnCounts();
    }

    updateColumnCounts() {
        const counts = {
            'todo': 0,
            'doing': 0,
            'done': 0
        };

        this.tasks.forEach(task => {
            if (counts.hasOwnProperty(task.status)) {
                counts[task.status]++;
            }
        });

        this.updateColumnHeaders(counts);
    }

    updateColumnHeaders(counts) {
        const headers = {
            'todo': this.container.querySelector('#todo-column .column-header'),
            'doing': this.container.querySelector('#doing-column .column-header'),
            'done': this.container.querySelector('#done-column .column-header')
        };

        const labels = {
            'todo': 'To Do',
            'doing': 'Doing', 
            'done': 'Done'
        };

        for (const [status, header] of Object.entries(headers)) {
            if (header) {
                header.textContent = `${labels[status]} (${counts[status]})`;
            }
        }
    }

    showError(message) {
        console.error(message);
        
        const existingError = this.container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            background-color: #e74c3c;
            color: white;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 16px;
            text-align: center;
            font-weight: 500;
        `;

        this.container.insertBefore(errorElement, this.container.firstChild);

        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }

    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }
}