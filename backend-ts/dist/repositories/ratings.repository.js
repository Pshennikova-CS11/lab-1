"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingsRepository = void 0;
const dbClient_1 = require("../db/dbClient");
class RatingsRepository {
    async findAll(query = {}) {
        const limit = Number(query.pageSize) || 100;
        const offset = ((Number(query.page) || 1) - 1) * limit;
        return await (0, dbClient_1.all)(`
            SELECT id, resourceId, userId, value, createdAt, updatedAt, deletedAt
            FROM Ratings
            ORDER BY createdAt DESC
            LIMIT ${limit} OFFSET ${offset}
        `);
    }
    async findById(id) {
        return await (0, dbClient_1.get)(`
            SELECT id, resourceId, userId, value, createdAt, updatedAt, deletedAt
            FROM Ratings
            WHERE id = ${id}
        `);
    }
    async findByUserAndResource(userId, resourceId) {
        return await (0, dbClient_1.get)(`
            SELECT id, resourceId, userId, value, createdAt, updatedAt, deletedAt
            FROM Ratings
            WHERE userId = ${userId} AND resourceId = ${resourceId}
        `);
    }
    async create(rating) {
        const result = await (0, dbClient_1.run)(`
            INSERT INTO Ratings (resourceId, userId, value, createdAt, updatedAt, deletedAt)
            VALUES (
                ${rating.resourceId},
                ${rating.userId},
                ${rating.value},
                '${rating.createdAt}',
                '${rating.updatedAt}',
                NULL
            )
        `);
        return (await this.findById(result.lastID));
    }
    async update(id, changes) {
        const existing = await this.findById(id);
        if (!existing) {
            return null;
        }
        const resourceId = changes.resourceId ?? existing.resourceId;
        const userId = changes.userId ?? existing.userId;
        const value = changes.value ?? existing.value;
        const updatedAt = changes.updatedAt ?? existing.updatedAt;
        const deletedAt = changes.deletedAt ?? existing.deletedAt;
        await (0, dbClient_1.run)(`
            UPDATE Ratings
            SET resourceId = ${resourceId},
                userId = ${userId},
                value = ${value},
                updatedAt = '${updatedAt}',
                deletedAt = ${deletedAt ? `'${deletedAt}'` : "NULL"}
            WHERE id = ${id}
        `);
        return await this.findById(id) || null;
    }
}
exports.ratingsRepository = new RatingsRepository();
