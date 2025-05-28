// ApiClient.js - Centralized API communication for Kanban board
// Implements all CRUD operations for tasks with consistent error handling

export class ApiClient {
  static API_BASE_URL = '/api';

  // GET /api/tasks - Retrieve all tasks
  static async getTasks() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks`);
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: Failed to fetch tasks`);
      }
      
      return responseData.data; // Return tasks array directly
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  // POST /api/tasks - Create new task
  static async createTask(taskData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: Failed to create task`);
      }
      
      return responseData.data; // Return created task object
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // PUT /api/tasks/:id - Update existing task
  static async updateTask(taskId, taskData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: Failed to update task`);
      }
      
      return responseData.data; // Return updated task object
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // DELETE /api/tasks/:id - Delete task
  static async deleteTask(taskId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: Failed to delete task`);
      }
      
      return responseData.data; // Return deleted task object
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // PATCH /api/tasks/:id/status - Update task status only
  static async updateTaskStatus(taskId, status) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: Failed to update task status`);
      }
      
      return responseData.data; // Return updated task object
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  // POST /api/tasks/:id/advice - Generate AI advice for specific task
  static async generateAiAdvice(taskId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks/${taskId}/advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: Failed to generate AI advice`);
      }
      
      return responseData.data; // Return advice data with generated advice and timestamp
    } catch (error) {
      console.error('Error generating AI advice:', error);
      throw error;
    }
  }
}