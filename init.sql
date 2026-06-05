-- Initial database setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table for example relationship
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (email, password, first_name, last_name) VALUES
('john.doe@example.com', '$2a$10$rQ4Q5Q5Q5Q5Q5Q5Q5Q5Q5u', 'John', 'Doe'),
('jane.smith@example.com', '$2a$10$rQ4Q5Q5Q5Q5Q5Q5Q5Q5Q5u', 'Jane', 'Smith')
ON CONFLICT (email) DO NOTHING;

-- Insert sample posts
INSERT INTO posts (title, content, user_id, is_published) 
SELECT 
    'Sample Post by ' || first_name,
    'This is a sample post content created by ' || first_name || ' ' || last_name,
    id,
    true
FROM users
ON CONFLICT DO NOTHING;