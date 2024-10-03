CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE todos (
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    task VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

SELECT * FROM users;