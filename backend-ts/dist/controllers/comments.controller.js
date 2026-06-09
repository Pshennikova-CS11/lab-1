"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComments = getComments;
exports.getCommentById = getCommentById;
exports.createComment = createComment;
exports.patchComment = patchComment;
exports.deleteComment = deleteComment;
const comments_service_1 = require("../services/comments.service");
async function getComments(req, res, next) {
    try {
        const result = await comments_service_1.commentsService.getAll(req.query);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function getCommentById(req, res, next) {
    try {
        const currentUserId = req.user.id;
        const result = await comments_service_1.commentsService.getById(req.params.id, currentUserId);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}
async function createComment(req, res, next) {
    try {
        const currentUserId = req.user.id;
        const result = await comments_service_1.commentsService.create(req.body, currentUserId);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
}
async function patchComment(req, res, next) {
    try {
        const currentUserId = req.user.id;
        const result = await comments_service_1.commentsService.patch(req.params.id, req.body, currentUserId);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}
async function deleteComment(req, res, next) {
    try {
        const currentUserId = req.user.id;
        await comments_service_1.commentsService.softDelete(req.params.id, currentUserId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
