const { all, get, run } = require("../db/dbClient");

async function findAllResources(sql) {
    return await all(sql);
}

async function findResourceById(resourceId) {
    return await get(`
        SELECT
            id,
            title,
            url,
            type,
            description,
            author,
            createdAt,
            averageRating,
            'beginner' AS difficulty
        FROM Resources
        WHERE id = ${resourceId};
    `);
}

async function findResourceWithComments(resourceId) {
    return await all(`
        SELECT
            r.id AS resourceId,
            r.title,
            r.url,
            r.type,
            r.description,
            r.author,
            r.createdAt,
            r.averageRating,
            c.id AS commentId,
            c.userId,
            c.text AS commentText,
            c.createdAt AS commentCreatedAt
        FROM Resources r
        LEFT JOIN Comments c ON r.id = c.resourceId
        WHERE r.id = ${resourceId}
        ORDER BY c.createdAt DESC;
    `);
}

async function insertResource(title, url, type, description, author, createdAt) {
    return await run(`
        INSERT INTO Resources (title, url, type, description, author, createdAt)
        VALUES (
            '${title}',
            '${url}',
            '${type}',
            '${description}',
            '${author}',
            '${createdAt}'
        );
    `);
}

async function updateResourceById(resourceId, title, url, type, description, author) {
    return await run(`
        UPDATE Resources
        SET
            title = '${title}',
            url = '${url}',
            type = '${type}',
            description = '${description}',
            author = '${author}'
        WHERE id = ${resourceId};
    `);
}

async function deleteResourceById(resourceId) {
    try {
        await run(`BEGIN TRANSACTION;`);

        await run(`
            DELETE FROM Ratings
            WHERE resourceId = ${resourceId};
        `);

        await run(`
            DELETE FROM Comments
            WHERE resourceId = ${resourceId};
        `);

        const result = await run(`
            DELETE FROM Resources
            WHERE id = ${resourceId};
        `);

        await run(`COMMIT;`);

        return result;
    } catch (error) {
        await run(`ROLLBACK;`);
        throw error;
    }
}

module.exports = {
    findAllResources,
    findResourceById,
    findResourceWithComments,
    insertResource,
    updateResourceById,
    deleteResourceById
};