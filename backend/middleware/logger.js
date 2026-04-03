/* MIDDLEWARE ЛОГУВАННЯ: фіксує метод, URL, статус-код і час виконання запиту */
function logger(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(
            `${req.method} ${req.originalUrl} -> ${res.statusCode} [${duration}ms]`
        );
    });

    next();
}

module.exports = logger;