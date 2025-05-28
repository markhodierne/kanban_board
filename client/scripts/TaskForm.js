// TaskForm.js - Task creation form component
// Handles task creation with validation and API integration

import { ApiClient } from './ApiClient.js';

export class TaskForm {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.form = null;
    this.isSubmitting = false;
    
    if (!this.container) {
      throw new Error(`Container with ID '${containerId}' not found`);
    }
    
    this.render();
    this.attachEventListeners();
  }

  render() {
    const formHtml = `
      <div class="task-form-container">
        <h3 class="form-title">Add New Task</h3>
        <form class="task-form" id="new-task-form">
          <div class="form-group">
            <label for="task-title-input" class="form-label">Title *</label>
            <input 
              type="text" 
              id="task-title-input" 
              name="title" 
              class="form-input" 
              placeholder="Enter task title..."
              required
              maxlength="255"
            />
            <div class="error-message" id="title-error"></div>
          </div>
          
          <div class="form-group">
            <label for="task-description-input" class="form-label">Description</label>
            <textarea 
              id="task-description-input" 
              name="description" 
              class="form-textarea" 
              placeholder="Enter task description (optional)..."
              rows="3"
              maxlength="1000"
            ></textarea>
            <div class="error-message" id="description-error"></div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="submit-button">
              <span class="button-text">Add Task</span>
              <span class="loading-spinner" id="loading-spinner" style="display: none;">�</span>
            </button>
            <button type="button" class="btn btn-secondary" id="clear-button">
              Clear Form
            </button>
          </div>
          
          <div class="form-message" id="form-message"></div>
        </form>
      </div>
    `;
    
    this.container.innerHTML = formHtml;
    this.form = this.container.querySelector('#new-task-form');
  }

  attachEventListeners() {
    if (!this.form) return;
    
    // Form submission
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log("submit hit")
      this.handleSubmit();
    });
    
    // Clear button
    const clearButton = this.container.querySelector('#clear-button');
    clearButton.addEventListener('click', () => {
      this.clearForm();
    });
    
    // Real-time validation
    const titleInput = this.container.querySelector('#task-title-input');
    titleInput.addEventListener('blur', () => {
      this.validateTitle();
    });
    
    titleInput.addEventListener('input', () => {
      this.clearFieldError('title');
    });
  }

  validateTitle() {
    const titleInput = this.container.querySelector('#task-title-input');
    const title = titleInput.value.trim();
    const errorElement = this.container.querySelector('#title-error');
    
    if (!title) {
      this.showFieldError('title', 'Title is required');
      return false;
    }
    
    if (title.length > 255) {
      this.showFieldError('title', 'Title must be 255 characters or less');
      return false;
    }
    
    this.clearFieldError('title');
    return true;
  }

  validateForm() {
    const titleValid = this.validateTitle();
    
    // Description validation (optional field)
    const descriptionInput = this.container.querySelector('#task-description-input');
    const description = descriptionInput.value.trim();
    
    if (description.length > 1000) {
      this.showFieldError('description', 'Description must be 1000 characters or less');
      return false;
    }
    
    this.clearFieldError('description');
    return titleValid;
  }

  async handleSubmit() {
    if (this.isSubmitting) return;
    
    if (!this.validateForm()) {
      this.showFormMessage('Please fix the errors above', 'error');
      return;
    }
    
    this.isSubmitting = true;
    this.setLoadingState(true);
    
    try {
      const formData = this.getFormData();
      const newTask = await ApiClient.createTask(formData);
      
      this.clearForm();
      this.showFormMessage('Task created successfully!', 'success');
      
      // Dispatch custom event for board to handle
      this.dispatchTaskCreatedEvent(newTask);
      
    } catch (error) {
      console.error('Error creating task:', error);
      this.showFormMessage(`Failed to create task: ${error.message}`, 'error');
    } finally {
      this.isSubmitting = false;
      this.setLoadingState(false);
    }
  }

  getFormData() {
    const titleInput = this.container.querySelector('#task-title-input');
    const descriptionInput = this.container.querySelector('#task-description-input');
    
    return {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim() || null
    };
  }

  clearForm() {
    if (!this.form) return;
    
    this.form.reset();
    this.clearAllErrors();
    this.clearFormMessage();
  }

  setLoadingState(loading) {
    const submitButton = this.container.querySelector('#submit-button');
    const buttonText = this.container.querySelector('.button-text');
    const loadingSpinner = this.container.querySelector('#loading-spinner');
    
    if (loading) {
      submitButton.disabled = true;
      buttonText.style.display = 'none';
      loadingSpinner.style.display = 'inline';
    } else {
      submitButton.disabled = false;
      buttonText.style.display = 'inline';
      loadingSpinner.style.display = 'none';
    }
  }

  showFieldError(fieldName, message) {
    const errorElement = this.container.querySelector(`#${fieldName}-error`);
    const inputElement = this.container.querySelector(`#task-${fieldName}-input`);
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    
    if (inputElement) {
      inputElement.classList.add('error');
    }
  }

  clearFieldError(fieldName) {
    const errorElement = this.container.querySelector(`#${fieldName}-error`);
    const inputElement = this.container.querySelector(`#task-${fieldName}-input`);
    
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
    
    if (inputElement) {
      inputElement.classList.remove('error');
    }
  }

  clearAllErrors() {
    const errorElements = this.container.querySelectorAll('.error-message');
    const inputElements = this.container.querySelectorAll('.form-input, .form-textarea');
    
    errorElements.forEach(element => {
      element.textContent = '';
      element.style.display = 'none';
    });
    
    inputElements.forEach(element => {
      element.classList.remove('error');
    });
  }

  showFormMessage(message, type) {
    const messageElement = this.container.querySelector('#form-message');
    
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.className = `form-message ${type}`;
      messageElement.style.display = 'block';
      
      // Auto-hide success messages after 3 seconds
      if (type === 'success') {
        setTimeout(() => {
          this.clearFormMessage();
        }, 3000);
      }
    }
  }

  clearFormMessage() {
    const messageElement = this.container.querySelector('#form-message');
    
    if (messageElement) {
      messageElement.textContent = '';
      messageElement.className = 'form-message';
      messageElement.style.display = 'none';
    }
  }

  dispatchTaskCreatedEvent(task) {
    const event = new CustomEvent('taskCreated', {
      detail: { task },
      bubbles: true
    });
    
    this.container.dispatchEvent(event);
  }
}