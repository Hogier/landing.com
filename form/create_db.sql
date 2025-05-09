-- Create database if not exists
CREATE DATABASE IF NOT EXISTS contact_form_db;

-- Use the database
USE contact_form_db;

-- Create contact form table
CREATE TABLE IF NOT EXISTS contacts (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    employees VARCHAR(20) NOT NULL,
    message TEXT DEFAULT NULL,
    agreement TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
); 