const { v4: uuidv4 } = require("uuid");
const { validateRating } = require("../validators/ratings.validator");

let ratings = [];

function getAllRatings() {
    return ratings;
}

function getRatingById(id) {
    const rating = ratings.find(r => r.id === id);

    if (!rating) {
        throw {
            code: "NOT_FOUND",
            message: "Rating not found",
            status: 404
        };
    }

    return rating;
}

function createRating(data) {
    const errors = validateRating(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const rating = {
        id: uuidv4(),
        resourceId: data.resourceId,
        userId: data.userId,
        value: data.value
    };

    ratings.push(rating);

    return rating;
}

function updateRating(id, data) {
    const rating = ratings.find(r => r.id === id);

    if (!rating) {
        throw {
            code: "NOT_FOUND",
            message: "Rating not found",
            status: 404
        };
    }

    const errors = validateRating(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    rating.resourceId = data.resourceId;
    rating.userId = data.userId;
    rating.value = data.value;

    return rating;
}

function deleteRating(id) {
    const exists = ratings.some(r => r.id === id);

    if (!exists) {
        throw {
            code: "NOT_FOUND",
            message: "Rating not found",
            status: 404
        };
    }

    ratings = ratings.filter(r => r.id !== id);
}

module.exports = {
    getAllRatings,
    getRatingById,
    createRating,
    updateRating,
    deleteRating
};