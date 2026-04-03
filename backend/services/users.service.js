/* валідація, створення, пошук, оновлення, видалення */
const { v4: uuidv4 } = require("uuid");
const { validateUser } = require("../validators/users.validator");

let users = [];

function getAllUsers() {
    return users;
}

function getUserById(id) {
    const user = users.find(u => u.id === id);

    /* 404 Not Found: якщо користувача за таким id не існує */
    if (!user) {
        throw {
            code: "NOT_FOUND",
            message: "User not found",
            status: 404
        };
    }

    return user;
}

function createUser(data) {
    const errors = validateUser(data);

    /* 400 Bad Request: серверна валідація некоректних вхідних даних */
    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const normalizedEmail = data.email.trim().toLowerCase();

    const existingUser = users.find(
        u => u.email.toLowerCase() === normalizedEmail
    );

    /* 400 Bad Request: серверна валідація некоректних вхідних даних */
    if (existingUser) {
        throw {
            code: "CONFLICT",
            message: "User with this email already exists",
            status: 409
        };
    }

    const user = {
        id: uuidv4(),
        name: data.name.trim(),
        email: normalizedEmail
    };

    users.push(user);

    return user;
}

function updateUser(id, data) {
    const user = users.find(u => u.id === id);

    if (!user) {
        throw {
            code: "NOT_FOUND",
            message: "User not found",
            status: 404
        };
    }

    const errors = validateUser(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const normalizedEmail = data.email.trim().toLowerCase();

    const duplicateUser = users.find(
        u => u.email.toLowerCase() === normalizedEmail && u.id !== id
    );

    if (duplicateUser) {
        throw {
            code: "CONFLICT",
            message: "User with this email already exists",
            status: 409
        };
    }

    user.name = data.name.trim();
    user.email = normalizedEmail;

    return user;
}

function deleteUser(id) {
    const exists = users.some(u => u.id === id);

    if (!exists) {
        throw {
            code: "NOT_FOUND",
            message: "User not found",
            status: 404
        };
    }

    users = users.filter(u => u.id !== id);
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};