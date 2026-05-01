const { run } = require("./dbClient"); // імпортуємо функцію run для виконання SQL-запитів типу

async function initDb() {
    await run("PRAGMA foreign_keys = ON;"); // увімкнення підтримки зовнішніх ключів у SQLite

    await run(`
        CREATE TABLE IF NOT EXISTS Users ( 
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        createdAt TEXT NOT NULL
        );
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS Resources (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL CHECK (type IN ('article', 'video', 'course', 'book')),
        description TEXT,
        author TEXT NOT NULL,
        createdAt TEXT NOT NULL
        );
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS Ratings (
        id INTEGER PRIMARY KEY,
        resourceId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
        createdAt TEXT NOT NULL,
        FOREIGN KEY (resourceId) REFERENCES Resources(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `);
    //ON DELETE CASCADE при видаленні користувача або ресурсу пов’язані
    // коментарі та оцінки теж видаляються автоматично
    await run(`
        CREATE TABLE IF NOT EXISTS Comments (
        id INTEGER PRIMARY KEY,
        resourceId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        text TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (resourceId) REFERENCES Resources(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `);

    await run(`
    CREATE INDEX IF NOT EXISTS idx_resources_type
    ON Resources(type);
    `);

    await run(`
    CREATE INDEX IF NOT EXISTS idx_resources_createdAt
    ON Resources(createdAt);
    `);

    try {
        await run(`
        ALTER TABLE Resources
        ADD COLUMN averageRating REAL DEFAULT 0;
    `);
    } catch (e) {
    }

    console.log("DB schema initialized");
}

module.exports = { initDb }; //експортуємо функцію initDb, щоб викликати її перед запуском сервера