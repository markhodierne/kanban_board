-- Kanban Board Database Schema
-- Creates tasks table with all required fields per ARCHITECTURE.md specification

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
    ai_advice TEXT,
    ai_advice_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status column for efficient filtering by column
CREATE INDEX idx_tasks_status ON tasks(status);

-- Create index on created_at for efficient ordering
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at when task is modified
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing and demonstration
INSERT INTO tasks (title, description, status) VALUES 
    ('Setup development environment', 'Install Node.js, PostgreSQL, and configure environment variables', 'done'),
    ('Create database schema', 'Design and implement the tasks table with proper indexes', 'doing'),
    ('Build frontend components', 'Create TaskCard, Board, and Form components using ES6 classes', 'todo'),
    ('Implement AI advice generation', 'Integrate OpenAI API for task guidance and risk analysis', 'todo');