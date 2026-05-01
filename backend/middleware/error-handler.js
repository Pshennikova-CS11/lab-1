function errorHandler(err, req, res, next) {
    const status = err.status || 500;

    console.error(
        `[ERROR] ${req.method} ${req.originalUrl} -> ${status}`,
        {
            code: err.code || "INTERNAL_SERVER_ERROR",
            message: err.message || "Unexpected error",
            details: err.details || null
        }
    );

    const response = {
        error: {
            code: err.code || "INTERNAL_SERVER_ERROR",
            message: err.message || "Unexpected error"
        }
    };

    if (err.details) {
        response.error.details = err.details;
    }

    res.status(status).json(response);
}

module.exports = errorHandler;