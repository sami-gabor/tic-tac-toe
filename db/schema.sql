CREATE DATABASE tictactoe_db;
SELECT DATABASE();
USE tictactoe_db;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(256),
    email VARCHAR(256),
    password_hash VARCHAR(256),
    score SMALLINT DEFAULT 0,
    github_id VARCHAR(256) DEFAULT NULL,
    github_username VARCHAR(256) DEFAULT NULL,
    joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users(username, email, password_hash) VALUES ('test', 'test@mail.com', 'password-hash-256');


CREATE TABLE tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(256),
    user_id INT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO tokens(token, user_id) VALUES ('some-256-hash', 1);
