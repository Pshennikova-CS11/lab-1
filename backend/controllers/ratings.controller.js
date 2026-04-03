const ratingsService = require("../services/ratings.service");
const { toRatingResponseDto } = require("../dtos/ratings.dto");

function getAll(req, res, next) {
    try {
        const ratings = ratingsService.getAllRatings();
        res.status(200).json(ratings.map(toRatingResponseDto));
    } catch (err) {
        next(err);
    }
}

function getById(req, res, next) {
    try {
        const rating = ratingsService.getRatingById(req.params.id);
        res.status(200).json(toRatingResponseDto(rating));
    } catch (err) {
        next(err);
    }
}

function create(req, res, next) {
    try {
        const rating = ratingsService.createRating(req.body);
        res.status(201).json(toRatingResponseDto(rating));
    } catch (err) {
        next(err);
    }
}

function update(req, res, next) {
    try {
        const rating = ratingsService.updateRating(req.params.id, req.body);
        res.status(200).json(toRatingResponseDto(rating));
    } catch (err) {
        next(err);
    }
}

function remove(req, res, next) {
    try {
        ratingsService.deleteRating(req.params.id);
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