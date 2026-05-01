"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const http_error_1 = require("../utils/http-error");
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        next(err);
        return;
    }
    if (err instanceof http_error_1.HttpError) {
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
