"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourcesRepository = void 0;
const dbClient_1 = require("../db/dbClient");
class ResourcesRepository {
    async findAll(query) {
        let sql = `
            SELECT *
            FROM Resources
            WHERE 1 = 1
        `;
        const params = [];
        if (query.type) {
            sql += " AND type = ?";
            params.push(query.type);
        }
        if (query.search) {
            sql += " AND title LIKE ?";
            params.push(`%${query.search}%`);
        }
        const allowedSortFields = new Set([
            "id",
            "title",
            "type",
            "author",
            "createdAt"
        ]);
        const sort = query.sort && allowedSortFields.has(query.sort)
            ? query.sort
            : "createdAt";
        const order = query.order === "asc" ? "ASC" : "DESC";
        sql += ` ORDER BY ${sort} ${order}`;
        const limit = Number(query.pageSize) || 10;
        const offset = ((Number(query.page) || 1) - 1) * limit;
        sql += " LIMIT ? OFFSET ?";
        params.push(limit, offset);
        return await (0, dbClient_1.all)(sql, params);
    }
    async findById(id) {
        return await (0, dbClient_1.get)(`
                SELECT *
                FROM Resources
                WHERE id = ?;
            `, [id]);
    }
    async create(data) {
        const now = new Date().toISOString();
        const result = await (0, dbClient_1.run)(`
            INSERT INTO Resources (title, url, type, description, author, createdAt)
            VALUES (?, ?, ?, ?, ?, ?);
            `, [
            data.title,
            data.url,
            data.type,
            data.description || "",
            data.author,
            now
        ]);
        return this.findById(result.lastID);
    }
    async update(id, data) {
        await (0, dbClient_1.run)(`
            UPDATE Resources
            SET
                title = ?,
                url = ?,
                type = ?,
                description = ?,
                author = ?
            WHERE id = ?;
            `, [
            data.title,
            data.url,
            data.type,
            data.description || "",
            data.author,
            id
        ]);
        return this.findById(id);
    }
    async delete(id) {
        return await (0, dbClient_1.run)(`
                DELETE FROM Resources
                WHERE id = ?;
            `, [id]);
    }
    async getWithComments(resourceId) {
        return await (0, dbClient_1.all)(`
                SELECT
                    r.id,
                    r.title,
                    c.text
                FROM Resources r
                         LEFT JOIN Comments c ON r.id = c.resourceId
                WHERE r.id = ?;
            `, [resourceId]);
    }
    async getWithDetails(query) {
        let sql = `
            SELECT
                r.id,
                r.title,
                r.type,
                r.author,
                r.createdAt,
                c.text AS commentText,
                u.name AS userName
            FROM Resources r
                     LEFT JOIN Comments c ON r.id = c.resourceId
                     LEFT JOIN Users u ON c.userId = u.id
            WHERE 1 = 1
        `;
        const params = [];
        if (query.type) {
            sql += " AND r.type = ?";
            params.push(query.type);
        }
        if (query.search) {
            sql += " AND r.title LIKE ?";
            params.push(`%${query.search}%`);
        }
        const allowedSortFields = {
            id: "r.id",
            title: "r.title",
            type: "r.type",
            author: "r.author",
            createdAt: "r.createdAt"
        };
        const sort = query.sort && allowedSortFields[query.sort]
            ? allowedSortFields[query.sort]
            : "r.createdAt";
        const order = query.order === "asc" ? "ASC" : "DESC";
        sql += ` ORDER BY ${sort} ${order}`;
        const limit = Number(query.pageSize) || 10;
        const offset = ((Number(query.page) || 1) - 1) * limit;
        sql += " LIMIT ? OFFSET ?";
        params.push(limit, offset);
        return await (0, dbClient_1.all)(sql, params);
    }
    async getAvgRating(resourceId) {
        return await (0, dbClient_1.get)(`
                SELECT AVG(value) AS avgRating
                FROM Ratings
                WHERE resourceId = ?;
            `, [resourceId]);
    }
}
exports.resourcesRepository = new ResourcesRepository();
