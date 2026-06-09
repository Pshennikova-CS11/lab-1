"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = initDb;
const dbClient_1 = require("./dbClient");
async function initDb() {
    await (0, dbClient_1.run)("PRAGMA foreign_keys = ON;");
    await (0, dbClient_1.run)(`
        CREATE TABLE IF NOT EXISTS Users (
                                             id INTEGER PRIMARY KEY,
                                             name TEXT NOT NULL,
                                             email TEXT NOT NULL UNIQUE,
                                             createdAt TEXT NOT NULL,
                                             updatedAt TEXT NOT NULL,
                                             deletedAt TEXT
        );
    `);
    await (0, dbClient_1.run)(`
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
    await (0, dbClient_1.run)(`
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
    await (0, dbClient_1.run)(`
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
    await (0, dbClient_1.run)(`
        CREATE INDEX IF NOT EXISTS idx_resources_type
        ON Resources(type);
    `);
    console.log("DB schema initialized");
}
