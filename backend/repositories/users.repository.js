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
    return await run(`
        DELETE FROM Users
        WHERE id = ${userId};
    `);
}

module.exports = {
    findAllUsers,
    findUserById,
    insertUser,
    updateUserById,
    deleteUserById
};