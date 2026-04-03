const commentsService = require("../services/comments.service");
const { toCommentResponseDto } = require("../dtos/comments.dto");

function getAll(req, res, next) {
    try {
        const comments = commentsService.getAllComments();
        res.status(200).json(comments.map(toCommentResponseDto));
    } catch (err) {
        next(err);
    }
}

function getById(req, res, next) {
    try {
        const comment = commentsService.getCommentById(req.params.id);
        res.status(200).json(toCommentResponseDto(comment));
    } catch (err) {
        next(err);
    }
}

function create(req, res, next) {
    try {
        const comment = commentsService.createComment(req.body);
        res.status(201).json(toCommentResponseDto(comment));
    } catch (err) {
        next(err);
    }
}

function update(req, res, next) {
    try {
        const comment = commentsService.updateComment(req.params.id, req.body);
        res.status(200).json(toCommentResponseDto(comment));
    } catch (err) {
        next(err);
    }
}

function remove(req, res, next) {
    try {
        commentsService.deleteComment(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};