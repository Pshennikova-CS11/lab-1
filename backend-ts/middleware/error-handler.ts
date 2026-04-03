import { NextFunction, Request, Response } from "express";
import { ApiErrorResponse } from "../types/api";
import { HttpError } from "../utils/http-error";

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response<ApiErrorResponse>,
    next: NextFunction
): void {
    if (res.headersSent) {
        next(err);
        return;
    }

    if (err instanceof HttpError) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            details: err.details
        });
        return;
    }

    console.error(err);

    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
}