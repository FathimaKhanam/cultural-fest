CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    venue VARCHAR(100),
    max_participants INTEGER
);