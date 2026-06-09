const { all, get, run } = require("../db/dbClient");

async function findAllComments() {
    return await all(
        `
            SELECT id, resourceId, userId, text, createdAt
            FROM Comments
            ORDER BY id DESC;
        `
    );
}

async function findCommentById(commentId) {
    return await get(
        `
            SELECT id, resourceId, userId, text, createdAt
            FROM Comments
            WHERE id = ?;
        `,
        [commentId]
    );
}

async function findCommentByIdForUser(commentId, currentUserId) {
    return await get(
        `
            SELECT id, resourceId, userId, text, createdAt
            FROM Comments
            WHERE id = ? AND userId = ?;
        `,
        [commentId, currentUserId]
    );
}

async function insertComment(resourceId, userId, text, createdAt) {
    return await run(
        `
            INSERT INTO Comments (resourceId, userId, text, createdAt)
            VALUES (?, ?, ?, ?);
        `,
        [resourceId, userId, text, createdAt]
    );
}

async function updateCommentById(commentId, resourceId, text, currentUserId) {
    return await run(
        `
            UPDATE Comments
            SET resourceId = ?,
                text = ?
            WHERE id = ? AND userId = ?;
        `,
        [resourceId, text, commentId, currentUserId]
    );
}

async function deleteCommentById(commentId, currentUserId) {
    return await run(
        `
        DELETE FROM Comments
        WHERE id = ? AND userId = ?;
        `,
        [commentId, currentUserId]
    );
}

module.exports = {
    findAllComments,
    findCommentById,
    findCommentByIdForUser,
    insertComment,
    updateCommentById,
    deleteCommentById
};