import { NextFunction, Request, Response } from "express";
import { ApiErrorResponse } from "../types/api";
import { HttpError } from "../utils/http-error";

function getErrorCode(statusCode: number): string {
    switch (statusCode) {
        case 400:
            return "VALIDATION_ERROR";
        case 401:
            return "UNAUTHORIZED";
        case 403:
            return "FORBIDDEN";
        case 404:
            return "NOT_FOUND";
        case 409:
            return "CONFLICT";
        default:
            return "INTERNAL_SERVER_ERROR";
    }
}

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
            error: {
                code: getErrorCode(err.statusCode),
                message: err.message,
                details: err.details ?? null
            }
        });

        return;
    }

    console.error(err);

    res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            details: null
        }
    });
}