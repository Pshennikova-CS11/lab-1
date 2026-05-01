const commentsService = require("../services/comments.service");

async function getAll(req, res, next) {
    try {
        const comments = await commentsService.getAllComments();
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const comment = await commentsService.getCommentById(req.params.id);
        res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const comment = await commentsService.createComment(req.body);
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const comment = await commentsService.updateComment(req.params.id, req.body);
        res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await commentsService.deleteComment(req.params.id);
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