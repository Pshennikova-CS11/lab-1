function errorHandler(err, req, res, next) {
    const status = err.status || 500;

    const code = err.code || "INTERNAL_SERVER_ERROR";

    const message = status === 500
        ? "Internal server error"
        : err.message || "Unexpected error";

    const details = status === 500
        ? null
        : err.details || null;

    console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${status}`, {
        code,
        message: err.message,
        details: err.details || null
    });

    res.status(status).json({
        error: {
            code,
            message,
            details
        }
    });
}

module.exports = errorHandler;