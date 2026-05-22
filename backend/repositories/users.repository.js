const { all, get, run } = require("../db/dbClient");

// 🔹 отримати всіх користувачів
async function findAllUsers() {
    return await all(`
        SELECT id, name, email, createdAt
        FROM Users
        ORDER BY id DESC;
    `);
}

// 🔹 отримати користувача по id
async function findUserById(userId) {
    return await get(`
        SELECT id, name, email, createdAt
        FROM Users
        WHERE id = ${userId};
    `);
}

// 🔹 створити користувача
async function insertUser(name, email, createdAt) {
    return await run(`
        INSERT INTO Users (name, email, createdAt)
        VALUES ('${name}', '${email}', '${createdAt}');
    `);
}

// 🔹 оновити користувача
async function updateUserById(userId, name, email) {
    return await run(`
        UPDATE Users
        SET name = '${name}', email = '${email}'
        WHERE id = ${userId};
    `);
}

// 🔹 видалити користувача
async function deleteUserById(userId) {
    try {
        await run(`BEGIN TRANSACTION;`);

        await run(`
            DELETE FROM Ratings
            WHERE userId = ${userId};
        `);

        await run(`
            DELETE FROM Comments
            WHERE userId = ${userId};
        `);

        const result = await run(`
            DELETE FROM Users
            WHERE id = ${userId};
        `);

        await run(`COMMIT;`);

        return result;
    } catch (error) {
        await run(`ROLLBACK;`);
        throw error;
    }
}

module.exports = {
    findAllUsers,
    findUserById,
    insertUser,
    updateUserById,
    deleteUserById
};