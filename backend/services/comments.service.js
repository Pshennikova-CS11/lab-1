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

async function getAllComments() {
    return await commentsRepository.findAllComments();
}

async function getCommentById(id, currentUserId) {
    const commentId = normalizeId(id, "comment id");
    const userId = normalizeId(currentUserId, "user id");

    const comment = await commentsRepository.findCommentByIdForUser(commentId, userId);

    if (!comment) {
        throw {
            code: "NOT_FOUND",
            message: "Comment not found",
            status: 404
        };
    }

    return comment;
}

async function createComment(data, currentUserId) {
    const userId = normalizeId(currentUserId, "user id");

    // userId з X-Demo-UserId
    const dataForValidation = {
        ...data,
        userId
    };

    const errors = validateComment(dataForValidation);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const resourceId = normalizeId(data.resourceId, "resource id");
    const text = String(data.text).trim();
    const now = new Date().toISOString();

    try {
        const result = await commentsRepository.insertComment(
            resourceId,
            userId,
            text,
            now
        );

        return await commentsRepository.findCommentByIdForUser(result.lastID, userId);
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

async function updateComment(id, data, currentUserId) {
    const commentId = normalizeId(id, "comment id");
    const userId = normalizeId(currentUserId, "user id");

    const dataForValidation = {
        ...data,
        userId
    };

    const errors = validateComment(dataForValidation);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const resourceId = normalizeId(data.resourceId, "resource id");
    const text = String(data.text).trim();

    try {
        const result = await commentsRepository.updateCommentById(
            commentId,
            resourceId,
            text,
            userId
        );

        if (result.changes === 0) {
            throw {
                code: "NOT_FOUND",
                message: "Comment not found",
                status: 404
            };
        }

        return await commentsRepository.findCommentByIdForUser(commentId, userId);
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

async function deleteComment(id, currentUserId) {
    const commentId = normalizeId(id, "comment id");
    const userId = normalizeId(currentUserId, "user id");

    const result = await commentsRepository.deleteCommentById(commentId, userId);

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