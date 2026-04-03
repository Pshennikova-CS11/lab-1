/* ЦЕНТРАЛІЗОВАНИЙ ERROR-HANDLER: формує єдиний формат помилки для всього API */
function errorHandler(err, req, res, next) {
    console.error(err);

    const status = err.status || 500;

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