"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbClient_1 = require("./dbClient");
const migrationsDir = path_1.default.join(__dirname, "migrations");
async function hasColumn(tableName, columnName) {
    const columns = await (0, dbClient_1.all)(`PRAGMA table_info(${tableName});`);
    return columns.some((column) => column.name === columnName);
}
async function applyAuditColumnsMigration() {
    const commentsHasUpdatedAt = await hasColumn("Comments", "updatedAt");
    const commentsHasDeletedAt = await hasColumn("Comments", "deletedAt");
    const ratingsHasUpdatedAt = await hasColumn("Ratings", "updatedAt");
    const ratingsHasDeletedAt = await hasColumn("Ratings", "deletedAt");
    if (!commentsHasUpdatedAt) {
        await (0, dbClient_1.run)(`ALTER TABLE Comments ADD COLUMN updatedAt TEXT;`);
        await (0, dbClient_1.run)(`UPDATE Comments SET updatedAt = createdAt WHERE updatedAt IS NULL;`);
    }
    if (!commentsHasDeletedAt) {
        await (0, dbClient_1.run)(`ALTER TABLE Comments ADD COLUMN deletedAt TEXT;`);
    }
    if (!ratingsHasUpdatedAt) {
        await (0, dbClient_1.run)(`ALTER TABLE Ratings ADD COLUMN updatedAt TEXT;`);
        await (0, dbClient_1.run)(`UPDATE Ratings SET updatedAt = createdAt WHERE updatedAt IS NULL;`);
    }
    if (!ratingsHasDeletedAt) {
        await (0, dbClient_1.run)(`ALTER TABLE Ratings ADD COLUMN deletedAt TEXT;`);
    }
}
async function runMigrations() {
    await (0, dbClient_1.run)("PRAGMA foreign_keys = ON;");
    await (0, dbClient_1.run)(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );
    `);
    const files = fs_1.default
        .readdirSync(migrationsDir)
        .sort()
        .filter((file) => file !== "003_add_audit_columns.sql");
    const applied = await (0, dbClient_1.all)(`
        SELECT name
        FROM schema_migrations;
    `);
    const appliedNames = applied.map((migration) => migration.name);
    for (const file of files) {
        if (appliedNames.includes(file)) {
            console.log("Skipping migration:", file);
            continue;
        }
        const sql = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), "utf-8");
        console.log("Running migration:", file);
        await (0, dbClient_1.exec)(sql);
        await (0, dbClient_1.run)(`
            INSERT INTO schema_migrations (name)
            VALUES ('${file}');
        `);
    }
    const auditMigrationName = "003_add_audit_columns";
    if (appliedNames.includes(auditMigrationName)) {
        console.log("Skipping migration:", auditMigrationName);
    }
    else {
        console.log("Running migration:", auditMigrationName);
        await applyAuditColumnsMigration();
        await (0, dbClient_1.run)(`
            INSERT INTO schema_migrations (name)
            VALUES ('${auditMigrationName}');
        `);
    }
    console.log("Migrations completed");
}
