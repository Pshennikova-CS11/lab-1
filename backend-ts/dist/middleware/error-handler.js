"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const http_error_1 = require("../utils/http-error");
function getErrorCode(statusCode) {
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
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        next(err);
        return;
    }
    if (err instanceof http_error_1.HttpError) {
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
