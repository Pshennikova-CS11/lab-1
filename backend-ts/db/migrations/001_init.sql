CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    deletedAt TEXT
);

CREATE TABLE IF NOT EXISTS Resources (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('article', 'video', 'course', 'book')),
    description TEXT,
    author TEXT NOT NULL,
    createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Comments (
    id INTEGER PRIMARY KEY,
    resourceId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    text TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (resourceId) REFERENCES Resources(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Ratings (
    id INTEGER PRIMARY KEY,
    resourceId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
    createdAt TEXT NOT NULL,
    FOREIGN KEY (resourceId) REFERENCES Resources(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);