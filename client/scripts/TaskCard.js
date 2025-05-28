import { ApiClient } from './ApiClient.js';

class TaskCard {
    constructor(task) {
        this.task = task;
        this.element = null;
        this.isEditing = false;
    }

    render() {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.dataset.taskId = this.task.id;

        taskCard.innerHTML = `
            <div class="task-title" data-field="title">${this.escapeHtml(this.task.title)}</div>
            <div class="task-description" data-field="description">${this.escapeHtml(this.task.description || '')}</div>
            
            <div class="ai-advice-section">
                <div class="ai-advice-placeholder">
                    AI advice will be available in future updates
                </div>
            </div>
            
            <div class="task-actions">
                ${this.renderStatusButton()}
                <button class="btn delete-button" data-action="delete">Delete</button>
            </div>
        `;

        this.element = taskCard;
        this.attachEventListeners();
        return taskCard;
    }

    renderStatusButton() {
        const statusMap = {
            'todo': { next: 'doing', label: 'Start' },
            'doing': { next: 'done', label: 'Complete' },
            'done': { next: 'todo', label: 'Restart' }
        };

        const statusInfo = statusMap[this.task.status];
        return `<button class="btn status-button" data-action="status" data-next-status="${statusInfo.next}">${statusInfo.label}</button>`;
    }

    attachEventListeners() {
        if (!this.element) return;

        this.element.addEventListener('click', (e) => this.handleClick(e));
        this.element.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        this.element.addEventListener('blur', (e) => this.handleBlur(e), true);
        this.element.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    handleClick(e) {
        const action = e.target.dataset.action;
        
        if (action === 'delete') {
            this.handleDelete();
        } else if (action === 'status') {
            const nextStatus = e.target.dataset.nextStatus;
            this.handleStatusChange(nextStatus);
        }
    }

    handleDoubleClick(e) {
        const field = e.target.dataset.field;
        if (field && (field === 'title' || field === 'description')) {
            this.enableInlineEditing(e.target, field);
        }
    }

    handleKeydown(e) {
        if (this.isEditing) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.saveEdit(e.target);
            } else if (e.key === 'Escape') {
                this.cancelEdit(e.target);
            }
        }
    }

    handleBlur(e) {
        if (this.isEditing && e.target.contentEditable === 'true') {
            this.saveEdit(e.target);
        }
    }

    enableInlineEditing(element, field) {
        if (this.isEditing) return;
        
        this.isEditing = true;
        this.originalContent = element.textContent;
        
        element.contentEditable = true;
        element.classList.add('editing');
        element.focus();
        
        this.selectAllText(element);
    }

    async saveEdit(element) {
        if (!this.isEditing) return;
        
        const field = element.dataset.field;
        const newValue = element.textContent.trim();
        
        if (newValue === this.originalContent) {
            this.cancelEdit(element);
            return;
        }

        if (field === 'title' && !newValue) {
            alert('Task title cannot be empty');
            element.textContent = this.originalContent;
            return;
        }

        try {
            const updatedData = { ...this.task };
            updatedData[field] = newValue;
            
            const result = await ApiClient.updateTask(this.task.id, updatedData);
            
            this.task[field] = newValue;
            this.finishEdit(element);
            
            this.dispatchTaskUpdate('updated');
        } catch (error) {
            console.error('Error updating task:', error);
            element.textContent = this.originalContent;
            this.finishEdit(element);
            alert('Failed to update task. Please try again.');
        }
    }

    cancelEdit(element) {
        element.textContent = this.originalContent;
        this.finishEdit(element);
    }

    finishEdit(element) {
        element.contentEditable = false;
        element.classList.remove('editing');
        this.isEditing = false;
        this.originalContent = null;
    }

    async handleStatusChange(nextStatus) {
        try {
            await ApiClient.updateTaskStatus(this.task.id, nextStatus);
            this.task.status = nextStatus;
            
            this.updateStatusButton();
            this.dispatchTaskUpdate('status-changed');
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Failed to update task status. Please try again.');
        }
    }

    async handleDelete() {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            await ApiClient.deleteTask(this.task.id);
            this.dispatchTaskUpdate('deleted');
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    }

    updateStatusButton() {
        const statusButton = this.element.querySelector('[data-action="status"]');
        if (statusButton) {
            const statusMap = {
                'todo': { next: 'doing', label: 'Start' },
                'doing': { next: 'done', label: 'Complete' },
                'done': { next: 'todo', label: 'Restart' }
            };
            
            const statusInfo = statusMap[this.task.status];
            statusButton.textContent = statusInfo.label;
            statusButton.dataset.nextStatus = statusInfo.next;
        }
    }

    dispatchTaskUpdate(type) {
        const event = new CustomEvent('taskUpdate', {
            detail: {
                type: type,
                task: this.task,
                element: this.element
            },
            bubbles: true
        });
        this.element.dispatchEvent(event);
    }

    selectAllText(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

export { TaskCard };