const { get } = require("../db/dbClient");

async function demoAuth(req, res, next) {
    try {
        const userIdHeader = req.header("X-Demo-UserId");

        if (!userIdHeader) {
            return res.status(401).json({
                error: {
                    code: "UNAUTHORIZED",
                    message: "Missing X-Demo-UserId header"
                }
            });
        }

        const userId = Number(userIdHeader);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(401).json({
                error: {
                    code: "UNAUTHORIZED",
                    message: "Invalid user id"
                }
            });
        }

        const user = await get(
            `
            SELECT id
            FROM Users
            WHERE id = ?;
            `,
            [userId]
        );

        if (!user) {
            return res.status(401).json({
                error: {
                    code: "UNAUTHORIZED",
                    message: "Unknown user"
                }
            });
        }

        req.user = {
            id: user.id
        };

        next();
    } catch (err) {
        next(err);
    }
}

module.exports = demoAuth;