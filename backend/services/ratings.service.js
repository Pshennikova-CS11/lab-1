const { all, get, run } = require("../db/dbClient");
const { validateRating } = require("../validators/ratings.validator");
const ratingsRepository = require("../repositories/ratings.repository");

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

async function getAllRatings() {
    return await all(`
        SELECT id, resourceId, userId, value, createdAt
        FROM Ratings
        ORDER BY id DESC;
    `);
}

async function getRatingById(id) {
    const ratingId = normalizeId(id, "rating id");

    const rating = await get(`
        SELECT id, resourceId, userId, value, createdAt
        FROM Ratings
        WHERE id = ${ratingId};
    `);

    if (!rating) {
        throw {
            code: "NOT_FOUND",
            message: "Rating not found",
            status: 404
        };
    }

    return rating;
}

async function createRating(data) {
    const errors = validateRating(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const resourceId = normalizeId(data.resourceId, "resource id");
    const userId = normalizeId(data.userId, "user id");
    const value = Number(data.value);
    const now = new Date().toISOString();

    try {
        const result = await run(`
            INSERT INTO Ratings (resourceId, userId, value, createdAt)
            VALUES (${resourceId}, ${userId}, ${value}, '${now}');
        `);

        return await getRatingById(result.lastID);
    } catch (err) {
        if (String(err.message).includes("FOREIGN KEY constraint failed")) {
            throw {
                code: "VALIDATION_ERROR",
                message: "Invalid resourceId or userId",
                status: 400
            };
        }

        if (String(err.message).includes("CHECK constraint failed")) {
            throw {
                code: "VALIDATION_ERROR",
                message: "Rating value must be from 1 to 5",
                status: 400
            };
        }

        throw err;
    }
}

async function updateRating(id, data) {
    const ratingId = normalizeId(id, "rating id");

    await getRatingById(ratingId);

    const errors = validateRating(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const resourceId = normalizeId(data.resourceId, "resource id");
    const userId = normalizeId(data.userId, "user id");
    const value = Number(data.value);

    try {
        const result = await run(`
            UPDATE Ratings
            SET resourceId = ${resourceId},
                userId = ${userId},
                value = ${value}
            WHERE id = ${ratingId};
        `);

        if (result.changes === 0) {
            throw {
                code: "NOT_FOUND",
                message: "Rating not found",
                status: 404
            };
        }

        const avg = await ratingsRepository.calculateAverageRating(resourceId);
        const averageRating = avg && avg.avgRating
            ? Number(avg.avgRating.toFixed(1))
            : 0;

        await ratingsRepository.updateResourceAverageRating(resourceId, averageRating);

        console.log("[DB] Rating updated:", { ratingId, resourceId, value });
        console.log("[DB] Resource average updated:", {
            resourceId,
            averageRating
        });

        return await getRatingById(ratingId);
    } catch (err) {
        if (String(err.message).includes("FOREIGN KEY constraint failed")) {
            throw {
                code: "VALIDATION_ERROR",
                message: "Invalid resourceId or userId",
                status: 400
            };
        }

        if (String(err.message).includes("CHECK constraint failed")) {
            throw {
                code: "VALIDATION_ERROR",
                message: "Rating value must be from 1 to 5",
                status: 400
            };
        }

        throw err;
    }
}

async function deleteRating(id) {
    const ratingId = normalizeId(id, "rating id");

    const rating = await get(`
        SELECT resourceId
        FROM Ratings
        WHERE id = ${ratingId};
    `);

    if (!rating) {
        throw {
            code: "NOT_FOUND",
            message: "Rating not found",
            status: 404
        };
    }

    const result = await run(`
        DELETE FROM Ratings
        WHERE id = ${ratingId};
    `);

    if (result.changes === 0) {
        throw {
            code: "NOT_FOUND",
            message: "Rating not found",
            status: 404
        };
    }

    //після створення / редагування / видалення рейтингу виконується перерахунок
    const avg = await ratingsRepository.calculateAverageRating(rating.resourceId);
    const averageRating = avg && avg.avgRating
        ? Number(avg.avgRating.toFixed(1))
        : 0;

    await ratingsRepository.updateResourceAverageRating(rating.resourceId, averageRating);

    console.log("[DB] Rating deleted:", { ratingId });
    console.log("[DB] Resource average updated:", {
        resourceId: rating.resourceId,
        averageRating
    });
}


async function addRating(data) {
    const errors = validateRating(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const resourceId = normalizeId(data.resourceId, "resource id");
    const userId = normalizeId(data.userId, "user id");
    const value = Number(data.value);
    const now = new Date().toISOString();

    const resource = await ratingsRepository.findResourceById(resourceId);

    if (!resource) {
        throw {
            code: "NOT_FOUND",
            message: "Resource not found",
            status: 404
        };
    }

    const user = await ratingsRepository.findUserById(userId);

    if (!user) {
        throw {
            code: "NOT_FOUND",
            message: "User not found",
            status: 404
        };
    }

    if (!Number.isInteger(value) || value < 1 || value > 5) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Rating value must be from 1 to 5",
            status: 400
        };
    }

    await ratingsRepository.insertRating(resourceId, userId, value, now);

    console.log("[DB] Rating created:", { resourceId, userId, value });

    const avg = await ratingsRepository.calculateAverageRating(resourceId);
    const averageRating = avg && avg.avgRating
        ? Number(avg.avgRating.toFixed(1))
        : 0;

    await ratingsRepository.updateResourceAverageRating(resourceId, averageRating);

    console.log("[DB] Resource average updated:", {
        resourceId,
        averageRating
    });

    return {
        success: true,
        resourceId,
        averageRating
    };
}

module.exports = {
    getAllRatings,
    getRatingById,
    createRating,
    updateRating,
    deleteRating,
    addRating
};