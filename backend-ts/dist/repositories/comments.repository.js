"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRepository = void 0;
const dbClient_1 = require("../db/dbClient");
class CommentsRepository {
    async findAll(query = {}) {
        const limit = Number(query.pageSize) || 100;
        const offset = ((Number(query.page) || 1) - 1) * limit;
        return await (0, dbClient_1.all)(`
                SELECT id, resourceId, userId, text, createdAt, updatedAt, deletedAt
                FROM Comments
                ORDER BY createdAt DESC
                    LIMIT ? OFFSET ?;
            `, [limit, offset]);
    }
    async findById(id) {
        return await (0, dbClient_1.get)(`
                SELECT id, resourceId, userId, text, createdAt, updatedAt, deletedAt
                FROM Comments
                WHERE id = ?;
            `, [id]);
    }
    async findByIdForUser(id, userId) {
        return await (0, dbClient_1.get)(`
            SELECT id, resourceId, userId, text, createdAt, updatedAt, deletedAt
            FROM Comments
            WHERE id = ? AND userId = ?;
            `, [id, userId]);
    }
    async create(comment) {
        const result = await (0, dbClient_1.run)(`
            INSERT INTO Comments (resourceId, userId, text, createdAt, updatedAt, deletedAt)
            VALUES (?, ?, ?, ?, ?, ?);
            `, [
            comment.resourceId,
            comment.userId,
            comment.text,
            comment.createdAt,
            comment.updatedAt,
            comment.deletedAt
        ]);
        return (await this.findByIdForUser(result.lastID, comment.userId));
    }
    async updateForUser(id, currentUserId, changes) {
        const existing = await this.findByIdForUser(id, currentUserId);
        if (!existing || existing.deletedAt !== null) {
            return null;
        }
        const resourceId = changes.resourceId ?? existing.resourceId;
        const text = changes.text ?? existing.text;
        await (0, dbClient_1.run)(`
            UPDATE Comments
            SET resourceId = ?,
                text = ?,
                updatedAt = ?
            WHERE id = ? AND userId = ?;
            `, [resourceId, text, changes.updatedAt, id, currentUserId]);
        return (await this.findByIdForUser(id, currentUserId)) || null;
    }
    async softDeleteForUser(id, currentUserId, deletedAt) {
        return await (0, dbClient_1.run)(`
            UPDATE Comments
            SET deletedAt = ?,
                updatedAt = ?
            WHERE id = ? AND userId = ?;
            `, [deletedAt, deletedAt, id, currentUserId]);
    }
}
exports.commentsRepository = new CommentsRepository();
