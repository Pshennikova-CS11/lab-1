"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoAuth = demoAuth;
const users_repository_1 = require("../repositories/users.repository");
async function demoAuth(req, res, next) {
    const userIdHeader = req.header("X-Demo-UserId");
    if (!userIdHeader) {
        res.status(401).json({
            error: {
                code: "UNAUTHORIZED",
                message: "Missing X-Demo-UserId header",
                details: null
            }
        });
        return;
    }
    const userId = Number(userIdHeader);
    if (!Number.isInteger(userId) || userId <= 0) {
        res.status(401).json({
            error: {
                code: "UNAUTHORIZED",
                message: "Invalid X-Demo-UserId header",
                details: null
            }
        });
        return;
    }
    const user = await users_repository_1.usersRepository.findById(userId);
    if (!user) {
        res.status(401).json({
            error: {
                code: "UNAUTHORIZED",
                message: "Unknown user",
                details: null
            }
        });
        return;
    }
    req.user = {
        id: userId
    };
    next();
}
