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
            email TEXT UNIQUE NOT NULL,
            createdAt TEXT NOT NULL
        );
    `);
    await (0, dbClient_1.run)(`
        CREATE TABLE IF NOT EXISTS Resources (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            url TEXT UNIQUE NOT NULL,
            type TEXT NOT NULL,
            author TEXT NOT NULL,
            createdAt TEXT NOT NULL
        );
    `);
    await (0, dbClient_1.run)(`
        CREATE TABLE IF NOT EXISTS Comments (
            id INTEGER PRIMARY KEY,
            resourceId INTEGER,
            userId INTEGER,
            text TEXT,
            FOREIGN KEY (resourceId) REFERENCES Resources(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `);
    await (0, dbClient_1.run)(`
        CREATE TABLE IF NOT EXISTS Ratings (
            id INTEGER PRIMARY KEY,
            resourceId INTEGER,
            userId INTEGER,
            value INTEGER,
            FOREIGN KEY (resourceId) REFERENCES Resources(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `);
    console.log("DB initialized");
}
