const express = require('express');
const db = require('../db/connection');
const { AiService } = require('../services/aiService');

const router = express.Router();

// GET /api/tasks - Returns all tasks
const getAllTasks = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting all tasks:', error);
    next(error);
  }
};

// POST /api/tasks - Creates new task
const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    
    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required and cannot be empty'
      });
    }
    
    const result = await db.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), description ? description.trim() : null]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating task:', error);
    next(error);
  }
};

// PUT /api/tasks/:id - Updates existing task
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    // Validate task ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }
    
    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required and cannot be empty'
      });
    }
    
    // Validate status if provided
    const validStatuses = ['todo', 'doing', 'done'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: todo, doing, done'
      });
    }
    
    // Check if task exists
    const existingTask = await db.query(
      'SELECT id FROM tasks WHERE id = $1',
      [parseInt(id)]
    );
    
    if (existingTask.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Update task
    const result = await db.query(
      'UPDATE tasks SET title = $1, description = $2, status = COALESCE($3, status) WHERE id = $4 RETURNING *',
      [title.trim(), description ? description.trim() : null, status, parseInt(id)]
    );
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating task:', error);
    next(error);
  }
};

// DELETE /api/tasks/:id - Deletes task
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate task ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }
    
    // Check if task exists and delete it
    const result = await db.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    next(error);
  }
};

// PATCH /api/tasks/:id/status - Updates task status only
const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate task ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }
    
    // Validate status
    const validStatuses = ['todo', 'doing', 'done'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status is required and must be one of: todo, doing, done'
      });
    }
    
    // Check if task exists and update status
    const result = await db.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, parseInt(id)]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    next(error);
  }
};

// POST /api/tasks/:id/advice - Generate AI advice for specific task
const generateTaskAdvice = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate task ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }
    
    // Get task details
    const taskResult = await db.query(
      'SELECT id, title, description FROM tasks WHERE id = $1',
      [parseInt(id)]
    );
    
    if (taskResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    const task = taskResult.rows[0];
    
    try {
      // Generate AI advice
      const aiService = new AiService();
      const advice = await aiService.generateTaskAdvice(task.title, task.description);
      
      // Store advice in database
      const updateResult = await db.query(
        'UPDATE tasks SET ai_advice = $1, ai_advice_timestamp = CURRENT_TIMESTAMP WHERE id = $2 RETURNING ai_advice, ai_advice_timestamp',
        [advice, parseInt(id)]
      );
      
      res.json({
        success: true,
        data: {
          task_id: parseInt(id),
          advice: updateResult.rows[0].ai_advice,
          generated_at: updateResult.rows[0].ai_advice_timestamp
        }
      });
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      res.status(503).json({
        success: false,
        message: aiError.message
      });
    }
  } catch (error) {
    console.error('Error generating task advice:', error);
    next(error);
  }
};

// Route definitions following RESTful conventions
router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', updateTaskStatus);
router.post('/:id/advice', generateTaskAdvice);

module.exports = router;