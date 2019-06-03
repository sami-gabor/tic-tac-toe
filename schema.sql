CREATE TABLE users(
    id INT(10) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20),
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
);

INSERT INTO users
    (name, email, password) 
VALUES 
    ('Sam', 'sam@gmail.com', 'a');

SELECT * FROM users;
