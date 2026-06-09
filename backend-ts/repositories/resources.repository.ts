import { all, get, run } from "../db/dbClient";

type ResourceQuery = {
    type?: string;
    search?: string;
    sort?: string;
    order?: string;
    page?: string;
    pageSize?: string;
};

type ResourceInput = {
    title: string;
    url: string;
    type: string;
    description?: string;
    author: string;
};

class ResourcesRepository {
    async findAll(query: ResourceQuery) {
        let sql = `
            SELECT *
            FROM Resources
            WHERE 1 = 1
        `;

        const params: unknown[] = [];

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

        return await all(sql, params);
    }

    async findById(id: number) {
        return await get(
            `
                SELECT *
                FROM Resources
                WHERE id = ?;
            `,
            [id]
        );
    }

    async create(data: ResourceInput) {
        const now = new Date().toISOString();

        const result = await run(
            `
            INSERT INTO Resources (title, url, type, description, author, createdAt)
            VALUES (?, ?, ?, ?, ?, ?);
            `,
            [
                data.title,
                data.url,
                data.type,
                data.description || "",
                data.author,
                now
            ]
        );

        return this.findById(result.lastID);
    }

    async update(id: number, data: ResourceInput) {
        await run(
            `
            UPDATE Resources
            SET
                title = ?,
                url = ?,
                type = ?,
                description = ?,
                author = ?
            WHERE id = ?;
            `,
            [
                data.title,
                data.url,
                data.type,
                data.description || "",
                data.author,
                id
            ]
        );

        return this.findById(id);
    }

    async delete(id: number) {
        return await run(
            `
                DELETE FROM Resources
                WHERE id = ?;
            `,
            [id]
        );
    }

    async getWithComments(resourceId: number) {
        return await all(
            `
                SELECT
                    r.id,
                    r.title,
                    c.text
                FROM Resources r
                         LEFT JOIN Comments c ON r.id = c.resourceId
                WHERE r.id = ?;
            `,
            [resourceId]
        );
    }

    async getWithDetails(query: ResourceQuery) {
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

        const params: unknown[] = [];

        if (query.type) {
            sql += " AND r.type = ?";
            params.push(query.type);
        }

        if (query.search) {
            sql += " AND r.title LIKE ?";
            params.push(`%${query.search}%`);
        }

        const allowedSortFields: Record<string, string> = {
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

        return await all(sql, params);
    }

    async getAvgRating(resourceId: number) {
        return await get(
            `
                SELECT AVG(value) AS avgRating
                FROM Ratings
                WHERE resourceId = ?;
            `,
            [resourceId]
        );
    }
}

export const resourcesRepository = new ResourcesRepository();