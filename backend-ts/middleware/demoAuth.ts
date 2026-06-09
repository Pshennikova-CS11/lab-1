import { NextFunction, Request, Response } from "express";
import { usersRepository } from "../repositories/users.repository";

export async function demoAuth(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
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

    const user = await usersRepository.findById(userId);

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