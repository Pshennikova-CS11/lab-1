const ratingsService = require("../services/ratings.service");

async function getAll(req, res, next) {
    try {
        const ratings = await ratingsService.getAllRatings();
        res.status(200).json(ratings);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const rating = await ratingsService.getRatingById(req.params.id);
        res.status(200).json(rating);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const result = await ratingsService.addRating(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const rating = await ratingsService.updateRating(req.params.id, req.body);
        res.status(200).json(rating);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await ratingsService.deleteRating(req.params.id);
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