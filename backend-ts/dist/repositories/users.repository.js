"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = void 0;
const dbClient_1 = require("../db/dbClient");
class UsersRepository {
    async findAll(query = {}) {
        const limit = Number(query.pageSize) || 100;
        const offset = ((Number(query.page) || 1) - 1) * limit;
        return await (0, dbClient_1.all)(`
            SELECT id, name, email, createdAt, updatedAt, deletedAt
            FROM Users
            ORDER BY createdAt DESC
            LIMIT ${limit} OFFSET ${offset}
        `);
    }
    async findById(id) {
        return await (0, dbClient_1.get)(`
            SELECT id, name, email, createdAt, updatedAt, deletedAt
            FROM Users
            WHERE id = ${id}
        `);
    }
    async findByEmail(email) {
        return await (0, dbClient_1.get)(`
            SELECT id, name, email, createdAt, updatedAt, deletedAt
            FROM Users
            WHERE email = '${email.toLowerCase()}'
        `);
    }
    async create(user) {
        const now = new Date().toISOString();
        const result = await (0, dbClient_1.run)(`
            INSERT INTO Users (name, email, createdAt, updatedAt, deletedAt)
            VALUES ('${user.name}', '${user.email}', '${now}', '${now}', NULL)
        `);
        return (await this.findById(result.lastID));
    }
    async update(id, changes) {
        const existing = await this.findById(id);
        if (!existing) {
            return null;
        }
        const name = changes.name ?? existing.name;
        const email = changes.email ?? existing.email;
        const deletedAt = changes.deletedAt ?? existing.deletedAt;
        const now = new Date().toISOString();
        await (0, dbClient_1.run)(`
            UPDATE Users
            SET name = '${name}',
                email = '${email}',
                updatedAt = '${now}',
                deletedAt = ${deletedAt ? `'${deletedAt}'` : "NULL"}
            WHERE id = ${id}
        `);
        return await this.findById(id) || null;
    }
    async delete(id) {
        const result = await (0, dbClient_1.run)(`
            DELETE FROM Users
            WHERE id = ${id}
        `);
        return result.changes > 0;
    }
}
exports.usersRepository = new UsersRepository();
