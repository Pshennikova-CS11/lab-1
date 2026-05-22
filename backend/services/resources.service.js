const resourcesRepository = require("../repositories/resources.repository");
const { validateResource } = require("../validators/resources.validator");

function escapeSqlString(value) {
    return String(value).replace(/'/g, "''");
}

function normalizeResourceId(id) {
    const resourceId = Number(id);

    if (!Number.isInteger(resourceId) || resourceId <= 0) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid resource id",
            status: 400
        };
    }

    return resourceId;
}

async function getAllResources(query = {}) {
    const { type, author, sort, order, limit } = query;

    const allowedSortFields = ["id", "title", "type", "author", "createdAt"];
    const allowedOrders = ["ASC", "DESC"];

    const sortField = allowedSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = allowedOrders.includes(String(order).toUpperCase())
        ? String(order).toUpperCase()
        : "DESC";

    let sql = `
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
    `;

    if (type) {
        sql += ` WHERE type = '${type}'`;
    }

    const filters = [];

    if (type) {
        const safeType = escapeSqlString(String(type).trim());
        filters.push(`type = '${safeType}'`);
    }

    if (author) {
        const safeAuthor = escapeSqlString(String(author).trim());
        filters.push(`author LIKE '%${safeAuthor}%'`);
    }

    if (filters.length > 0) {
        sql += ` WHERE ` + filters.join(" AND ");
    }

    sql += ` ORDER BY ${sortField} ${sortOrder}`;

    if (limit) {
        const normalizedLimit = Number(limit);

        if (Number.isInteger(normalizedLimit) && normalizedLimit > 0) {
            sql += ` LIMIT ${normalizedLimit}`;
        }
    }

    sql += `;`;

    return await resourcesRepository.findAllResources(sql);
}

async function getResourceById(id) {
    const resourceId = normalizeResourceId(id);

    const resource = await resourcesRepository.findResourceById(resourceId);

    if (!resource) {
        throw {
            code: "NOT_FOUND",
            message: "Resource not found",
            status: 404
        };
    }

    return resource;
}

async function getResourceWithComments(id) {
    const resourceId = normalizeResourceId(id);

    const rows = await resourcesRepository.findResourceWithComments(resourceId);

    if (!rows.length) {
        throw {
            code: "NOT_FOUND",
            message: "Resource not found",
            status: 404
        };
    }

    return {
        id: rows[0].resourceId,
        title: rows[0].title,
        url: rows[0].url,
        type: rows[0].type,
        description: rows[0].description,
        author: rows[0].author,
        createdAt: rows[0].createdAt,
        averageRating: rows[0].averageRating || 0,
        comments: rows
            .filter(row => row.commentId !== null)
            .map(row => ({
                id: row.commentId,
                userId: row.userId,
                text: row.commentText,
                createdAt: row.commentCreatedAt
            }))
    };
}

async function createResource(data) {
    const errors = validateResource(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const safeTitle = escapeSqlString(data.title);
    const safeUrl = escapeSqlString(data.url);
    const safeType = escapeSqlString(data.type);
    const safeDescription = escapeSqlString(data.description || "");
    const safeAuthor = escapeSqlString(data.author);
    const now = new Date().toISOString();

    try {
        const result = await resourcesRepository.insertResource(
            safeTitle,
            safeUrl,
            safeType,
            safeDescription,
            safeAuthor,
            now
        );

        return await getResourceById(result.lastID);
    } catch (err) {
        const message = String(err.message);

        if (message.includes("UNIQUE constraint failed")) {
            throw {
                code: "CONFLICT",
                message: "Resource with this URL already exists",
                status: 409
            };
        }

        if (message.includes("CHECK constraint failed")) {
            throw {
                code: "VALIDATION_ERROR",
                message: "Invalid resource type",
                status: 400
            };
        }

        throw err;
    }
}

async function updateResource(id, data) {
    const resourceId = normalizeResourceId(id);

    await getResourceById(resourceId);

    const errors = validateResource(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const safeTitle = escapeSqlString(data.title);
    const safeUrl = escapeSqlString(data.url);
    const safeType = escapeSqlString(data.type);
    const safeDescription = escapeSqlString(data.description || "");
    const safeAuthor = escapeSqlString(data.author);

    try {
        const result = await resourcesRepository.updateResourceById(
            resourceId,
            safeTitle,
            safeUrl,
            safeType,
            safeDescription,
            safeAuthor
        );

        if (result.changes === 0) {
            throw {
                code: "NOT_FOUND",
                message: "Resource not found",
                status: 404
            };
        }

        return await getResourceById(resourceId);
    } catch (err) {
        const message = String(err.message);

        if (message.includes("UNIQUE constraint failed")) {
            throw {
                code: "CONFLICT",
                message: "Resource with this URL already exists",
                status: 409
            };
        }

        if (message.includes("CHECK constraint failed")) {
            throw {
                code: "VALIDATION_ERROR",
                message: "Invalid resource type",
                status: 400
            };
        }

        throw err;
    }
}

async function deleteResource(id) {
    const resourceId = normalizeResourceId(id);

    const result = await resourcesRepository.deleteResourceById(resourceId);

    if (result.changes === 0) {
        throw {
            code: "NOT_FOUND",
            message: "Resource not found",
            status: 404
        };
    }
}

module.exports = {
    getAllResources,
    getResourceById,
    getResourceWithComments,
    createResource,
    updateResource,
    deleteResource
};