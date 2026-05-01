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
        let sql = "SELECT * FROM Resources WHERE 1=1";

        if (query.type) {
            sql += ` AND type = '${query.type}'`;
        }

        if (query.search) {
            sql += ` AND title LIKE '%${query.search}%'`; // SQLi demo // використання рядкової конкатенації є небезпечним
        }

        const sort = query.sort || "createdAt";
        const order = query.order === "asc" ? "ASC" : "DESC";

        sql += ` ORDER BY ${sort} ${order}`;

        const limit = Number(query.pageSize) || 10;
        const offset = ((Number(query.page) || 1) - 1) * limit;

        sql += ` LIMIT ${limit} OFFSET ${offset}`;

        return await all(sql);
    }

    async findById(id: number) {
        return await get(`
            SELECT * FROM Resources WHERE id = ${id}
        `);
    }

    async create(data: ResourceInput) {
        const now = new Date().toISOString();

        const result = await run(`
            INSERT INTO Resources (title, url, type, description, author, createdAt)
            VALUES (
                           '${data.title}',
                           '${data.url}',
                           '${data.type}',
                           '${data.description || ""}',
                           '${data.author}',
                           '${now}'
                   )
        `);

        return this.findById(result.lastID);
    }

    async update(id: number, data: ResourceInput) {
        await run(`
            UPDATE Resources
            SET title='${data.title}',
                url='${data.url}',
                type='${data.type}',
                description='${data.description || ""}',
                author='${data.author}'
            WHERE id=${id}
        `);

        return this.findById(id);
    }

    async delete(id: number) {
        return await run(`
            DELETE FROM Resources WHERE id=${id}
        `);
    }

    async getWithComments(resourceId: number) {
        return await all(`
            SELECT r.id, r.title, c.text
            FROM Resources r
            LEFT JOIN Comments c ON r.id = c.resourceId
            WHERE r.id = ${resourceId} 
        `);
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
            WHERE 1=1
        `;

        if (query.type) {
            sql += ` AND r.type = '${query.type}'`;
        }

        if (query.search) {
            sql += ` AND r.title LIKE '%${query.search}%'`;
        }

        const sort = query.sort || "r.createdAt";
        const order = query.order === "asc" ? "ASC" : "DESC";

        sql += ` ORDER BY ${sort} ${order}`;

        const limit = Number(query.pageSize) || 10;
        const offset = ((Number(query.page) || 1) - 1) * limit;

        sql += ` LIMIT ${limit} OFFSET ${offset}`;

        return await all(sql);
    }

    async getAvgRating(resourceId: number) {
        return await get(`
            SELECT AVG(value) as avgRating
            FROM Ratings
            WHERE resourceId = ${resourceId}
        `);
    }
}

export const resourcesRepository = new ResourcesRepository();