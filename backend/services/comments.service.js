const commentsRepository = require("../repositories/comments.repository");
const { validateComment } = require("../validators/comments.validator");

function normalizeId(value, fieldName) {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
        throw {
            code: "VALIDATION_ERROR",
            message: `Invalid ${fieldName}`,
            status: 400
        };
    }

    return id;
}

function escapeSqlString(value) {
    return String(value).replace(/'/g, "''");
}

async function getAllComments() {
    return await commentsRepository.findAllComments();
}

async function getCommentById(id) {
    const commentId = normalizeId(id, "comment id");

    const comment = await commentsRepository.findCommentById(commentId);

    if (!comment) {
        throw {
            code: "NOT_FOUND",
            message: "Comment not found",
            status: 404
        };
    }

    return comment;
}

async function createComment(data) {
    const errors = validateComment(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const resourceId = normalizeId(data.resourceId, "resource id");
    const userId = normalizeId(data.userId, "user id");
    const safeText = escapeSqlString(data.text.trim());
    const now = new Date().toISOString();

    try {
        const result = await commentsRepository.insertComment(resourceId, userId, safeText, now);
        return await getCommentById(result.lastID);
    } catch (err) {
        if (String(err.message).includes("FOREIGN KEY constraint failed")) {
            throw {
                code: "VALIDATION_ERROR",
                message: "Invalid resourceId or userId",
                status: 400
            };
        }

        throw err;
    }
}

async function updateComment(id, data) {
    const commentId = normalizeId(id, "comment id");

    await getCommentById(commentId);

    const errors = validateComment(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const resourceId = normalizeId(data.resourceId, "resource id");
    const userId = normalizeId(data.userId, "user id");
    const safeText = escapeSqlString(data.text.trim());

    try {
        const result = await commentsRepository.updateCommentById(
            commentId,
            resourceId,
            userId,
            safeText
        );

        if (result.changes === 0) {
            throw {
                code: "NOT_FOUND",
                message: "Comment not found",
                status: 404
            };
        }

        return await getCommentById(commentId);
    } catch (err) {
        if (String(err.message).includes("FOREIGN KEY constraint failed")) {
            throw {
                code: "VALIDATION_ERROR",
                message: "Invalid resourceId or userId",
                status: 400
            };
        }

        throw err;
    }
}

async function deleteComment(id) {
    const commentId = normalizeId(id, "comment id");

    const result = await commentsRepository.deleteCommentById(commentId);

    if (result.changes === 0) {
        throw {
            code: "NOT_FOUND",
            message: "Comment not found",
            status: 404
        };
    }
}

module.exports = {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
};