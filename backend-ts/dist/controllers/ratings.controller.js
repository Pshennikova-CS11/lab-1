"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRatings = getRatings;
exports.getRatingById = getRatingById;
exports.createRating = createRating;
exports.patchRating = patchRating;
exports.deleteRating = deleteRating;
const ratings_service_1 = require("../services/ratings.service");
function getRatings(req, res, next) {
    try {
        const result = ratings_service_1.ratingsService.getAll(req.query);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
function getRatingById(req, res, next) {
    try {
        const result = ratings_service_1.ratingsService.getById(req.params.id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
function createRating(req, res, next) {
    try {
        const result = ratings_service_1.ratingsService.create(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
}
function patchRating(req, res, next) {
    try {
        const result = ratings_service_1.ratingsService.patch(req.params.id, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
function deleteRating(req, res, next) {
    try {
        ratings_service_1.ratingsService.softDelete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
