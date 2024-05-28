-- Create table for Users
CREATE TABLE users
(
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    email              VARCHAR(255) NOT NULL UNIQUE,
    password           VARCHAR(255) NOT NULL UNIQUE,
    created_date       TIMESTAMP,
    last_modified_date TIMESTAMP,
    deleted            BOOLEAN DEFAULT FALSE
);

-- Create table for Watchlists
CREATE TABLE watchlists
(
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id            BIGINT,
    created_date       TIMESTAMP,
    last_modified_date TIMESTAMP,
    deleted            BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create table for Watchlist Items
CREATE TABLE watchlist_items
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    watchlist_id BIGINT,
    symbol       VARCHAR(255) NOT NULL,
    FOREIGN KEY (watchlist_id) REFERENCES watchlists (id)
);
