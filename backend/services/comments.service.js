const { v4: uuidv4 } = require("uuid");
const { validateComment } = require("../validators/comments.validator");

let comments = [];

function getAllComments() {
    return comments;
}

function getCommentById(id) {
    const comment = comments.find(c => c.id === id);

    if (!comment) {
        throw {
            code: "NOT_FOUND",
            message: "Comment not found",
            status: 404
        };
    }

    return comment;
}

function createComment(data) {
    const errors = validateComment(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const comment = {
        id: uuidv4(),
        resourceId: data.resourceId,
        userId: data.userId,
        text: data.text
    };

    comments.push(comment);

    return comment;
}

function updateComment(id, data) {
    const comment = comments.find(c => c.id === id);

    if (!comment) {
        throw {
            code: "NOT_FOUND",
            message: "Comment not found",
            status: 404
        };
    }

    const errors = validateComment(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    comment.resourceId = data.resourceId;
    comment.userId = data.userId;
    comment.text = data.text;

    return comment;
}

function deleteComment(id) {
    const exists = comments.some(c => c.id === id);

    if (!exists) {
        throw {
            code: "NOT_FOUND",
            message: "Comment not found",
            status: 404
        };
    }

    comments = comments.filter(c => c.id !== id);
}

module.exports = {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
};