-- Crear base de datos (ajusta el nombre si quieres)
CREATE DATABASE IF NOT EXISTS appdatabase;
USE appdatabase;

-- Tabla: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Tabla: csv_datasets
CREATE TABLE IF NOT EXISTS csv_datasets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    data JSON NOT NULL,
    headers JSON NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- Tabla: templates
CREATE TABLE IF NOT EXISTS templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    canvas_json JSON NOT NULL,
    csv_id INT,
    user_id INT NOT NULL,
    FOREIGN KEY (csv_id) REFERENCES csv_datasets(id)
        ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

GRANT ALL PRIVILEGES ON appdatabase.* TO 'appuser'@'%';
FLUSH PRIVILEGES;
