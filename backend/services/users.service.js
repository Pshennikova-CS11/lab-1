const usersRepository = require("../repositories/users.repository");
const { validateUser } = require("../validators/users.validator");

function escapeSqlString(value) {
    return String(value).replace(/'/g, "''");
}

function normalizeUserId(id) {
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid user id",
            status: 400
        };
    }

    return userId;
}

// 🔹 GET ALL
async function getAllUsers() {
    return await usersRepository.findAllUsers();
}

// 🔹 GET BY ID
async function getUserById(id) {
    const userId = normalizeUserId(id);

    const user = await usersRepository.findUserById(userId);

    if (!user) {
        throw {
            code: "NOT_FOUND",
            message: "User not found",
            status: 404
        };
    }

    return user;
}

// 🔹 CREATE
async function createUser(data) {
    const errors = validateUser(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const normalizedName = data.name.trim();
    const normalizedEmail = data.email.trim().toLowerCase();

    const safeName = escapeSqlString(normalizedName);
    const safeEmail = escapeSqlString(normalizedEmail);
    const now = new Date().toISOString();

    try {
        const result = await usersRepository.insertUser(safeName, safeEmail, now);
        return await getUserById(result.lastID);
    } catch (err) {
        if (String(err.message).includes("UNIQUE constraint failed")) {
            throw {
                code: "CONFLICT",
                message: "User with this email already exists",
                status: 409
            };
        }

        throw err;
    }
}

// 🔹 UPDATE
async function updateUser(id, data) {
    const userId = normalizeUserId(id);

    await getUserById(userId);

    const errors = validateUser(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const normalizedName = data.name.trim();
    const normalizedEmail = data.email.trim().toLowerCase();

    const safeName = escapeSqlString(normalizedName);
    const safeEmail = escapeSqlString(normalizedEmail);

    try {
        const result = await usersRepository.updateUserById(userId, safeName, safeEmail);

        if (result.changes === 0) {
            throw {
                code: "NOT_FOUND",
                message: "User not found",
                status: 404
            };
        }

        return await getUserById(userId);
    } catch (err) {
        if (String(err.message).includes("UNIQUE constraint failed")) {
            throw {
                code: "CONFLICT",
                message: "User with this email already exists",
                status: 409
            };
        }

        throw err;
    }
}

// 🔹 DELETE
async function deleteUser(id) {
    const userId = normalizeUserId(id);

    const result = await usersRepository.deleteUserById(userId);

    if (result.changes === 0) {
        throw {
            code: "NOT_FOUND",
            message: "User not found",
            status: 404
        };
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};