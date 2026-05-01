"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComments = getComments;
exports.getCommentById = getCommentById;
exports.createComment = createComment;
exports.patchComment = patchComment;
exports.deleteComment = deleteComment;
const comments_service_1 = require("../services/comments.service");
function getComments(req, res, next) {
    try {
        const result = comments_service_1.commentsService.getAll(req.query);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
function getCommentById(req, res, next) {
    try {
        const result = comments_service_1.commentsService.getById(req.params.id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
function createComment(req, res, next) {
    try {
        const result = comments_service_1.commentsService.create(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
}
function patchComment(req, res, next) {
    try {
        const result = comments_service_1.commentsService.patch(req.params.id, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
function deleteComment(req, res, next) {
    try {
        comments_service_1.commentsService.softDelete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
