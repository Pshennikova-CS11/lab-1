const { all, get, run } = require("../db/dbClient");

async function findAllComments() {
    return await all(`
        SELECT id, resourceId, userId, text, createdAt
        FROM Comments
        ORDER BY id DESC;
    `);
}

async function findCommentById(commentId) {
    return await get(`
        SELECT id, resourceId, userId, text, createdAt
        FROM Comments
        WHERE id = ${commentId};
    `);
}

async function insertComment(resourceId, userId, text, createdAt) {
    return await run(`
        INSERT INTO Comments (resourceId, userId, text, createdAt)
        VALUES (${resourceId}, ${userId}, '${text}', '${createdAt}');
    `);
}

async function updateCommentById(commentId, resourceId, userId, text) {
    return await run(`
        UPDATE Comments
        SET resourceId = ${resourceId},
            userId = ${userId},
            text = '${text}'
        WHERE id = ${commentId};
    `);
}

async function deleteCommentById(commentId) {
    return await run(`
        DELETE FROM Comments
        WHERE id = ${commentId};
    `);
}

module.exports = {
    findAllComments,
    findCommentById,
    insertComment,
    updateCommentById,
    deleteCommentById
};