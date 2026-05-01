import fs from "fs";
import path from "path";
import { all, exec, get, run } from "./dbClient";

const migrationsDir = path.join(__dirname, "migrations");

async function hasColumn(tableName: string, columnName: string): Promise<boolean> {
    const columns = await all<{ name: string }>(`PRAGMA table_info(${tableName});`);
    return columns.some((column) => column.name === columnName);
}

async function applyAuditColumnsMigration() {
    const commentsHasUpdatedAt = await hasColumn("Comments", "updatedAt");
    const commentsHasDeletedAt = await hasColumn("Comments", "deletedAt");
    const ratingsHasUpdatedAt = await hasColumn("Ratings", "updatedAt");
    const ratingsHasDeletedAt = await hasColumn("Ratings", "deletedAt");

    if (!commentsHasUpdatedAt) {
        await run(`ALTER TABLE Comments ADD COLUMN updatedAt TEXT;`);
        await run(`UPDATE Comments SET updatedAt = createdAt WHERE updatedAt IS NULL;`);
    }

    if (!commentsHasDeletedAt) {
        await run(`ALTER TABLE Comments ADD COLUMN deletedAt TEXT;`);
    }

    if (!ratingsHasUpdatedAt) {
        await run(`ALTER TABLE Ratings ADD COLUMN updatedAt TEXT;`);
        await run(`UPDATE Ratings SET updatedAt = createdAt WHERE updatedAt IS NULL;`);
    }

    if (!ratingsHasDeletedAt) {
        await run(`ALTER TABLE Ratings ADD COLUMN deletedAt TEXT;`);
    }
}

export async function runMigrations() {
    await run("PRAGMA foreign_keys = ON;");

    await run(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );
    `);

    const files = fs
        .readdirSync(migrationsDir)
        .sort()
        .filter((file) => file !== "003_add_audit_columns.sql");

    const applied = await all<{ name: string }>(`
        SELECT name
        FROM schema_migrations;
    `);

    const appliedNames = applied.map((migration) => migration.name);

    for (const file of files) {
        if (appliedNames.includes(file)) {
            console.log("Skipping migration:", file);
            continue;
        }

        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");

        console.log("Running migration:", file);

        await exec(sql);

        await run(`
            INSERT INTO schema_migrations (name)
            VALUES ('${file}');
        `);
    }

    const auditMigrationName = "003_add_audit_columns";

    if (appliedNames.includes(auditMigrationName)) {
        console.log("Skipping migration:", auditMigrationName);
    } else {
        console.log("Running migration:", auditMigrationName);

        await applyAuditColumnsMigration();

        await run(`
            INSERT INTO schema_migrations (name)
            VALUES ('${auditMigrationName}');
        `);
    }

    console.log("Migrations completed");
}