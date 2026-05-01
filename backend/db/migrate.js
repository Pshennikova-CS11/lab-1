const { get, run } = require("./dbClient");

//створюється таблиця для обліку міграцій
async function ensureMigrationsTable() {
    await run(`
        CREATE TABLE IF NOT EXISTS schema_migrations ( 
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            appliedAt TEXT NOT NULL
        );
    `);
}

//перевіряється, чи вже застосована міграція
async function isMigrationApplied(name) {
    const row = await get(`
        SELECT id
        FROM schema_migrations
        WHERE name = '${name}';
    `);

    return !!row;
}

async function markMigrationApplied(name) {
    const now = new Date().toISOString();

    await run(`
        INSERT INTO schema_migrations (name, appliedAt) //після виконання вона записується в таблицю
        VALUES ('${name}', '${now}');
    `);
}

async function applyMigration(name, sql) {
    const alreadyApplied = await isMigrationApplied(name);

    if (alreadyApplied) {
        console.log(`[MIGRATION] skipped: ${name}`);
        return;
    }

    await run(sql);
    await markMigrationApplied(name);

    console.log(`[MIGRATION] applied: ${name}`);
}

async function runMigrations() {
    await ensureMigrationsTable();

    await applyMigration(
        "001_init_tables",
        `
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            createdAt TEXT NOT NULL
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

        CREATE TABLE IF NOT EXISTS Ratings (
            id INTEGER PRIMARY KEY,
            resourceId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
            createdAt TEXT NOT NULL,
            FOREIGN KEY (resourceId) REFERENCES Resources(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
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
        `
    );

    await applyMigration(
        "002_add_indexes",
        ` 
    CREATE INDEX IF NOT EXISTS idx_resources_type 
    ON Resources(type);

    CREATE INDEX IF NOT EXISTS idx_resources_createdAt 
    ON Resources(createdAt);
    `
    );


    console.log("[MIGRATION] completed");
}

module.exports = { runMigrations };