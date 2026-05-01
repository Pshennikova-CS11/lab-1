const { get, run } = require("../db/dbClient");

async function findResourceById(resourceId) {
    return await get(`
        SELECT id
        FROM Resources
        WHERE id = ${resourceId};
    `);
}

async function findUserById(userId) {
    return await get(`
        SELECT id
        FROM Users
        WHERE id = ${userId};
    `);
}

async function insertRating(resourceId, userId, value, createdAt) {
    return await run(`
        INSERT INTO Ratings (resourceId, userId, value, createdAt)
        VALUES (${resourceId}, ${userId}, ${value}, '${createdAt}');
    `);
}

//обчислення середнього
async function calculateAverageRating(resourceId) {
    return await get(`
        SELECT AVG(value) AS avgRating
        FROM Ratings
        WHERE resourceId = ${resourceId};
    `);
}

//оновлення ресурсу
async function updateResourceAverageRating(resourceId, averageRating) {
    return await run(`
        UPDATE Resources
        SET averageRating = ${averageRating}
        WHERE id = ${resourceId};
    `);
}

module.exports = {
    findResourceById,
    findUserById,
    insertRating,
    calculateAverageRating,
    updateResourceAverageRating
};