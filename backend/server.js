const express = require("express");
// const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
//const path = require("path");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error-handler");

const usersRoutes = require("./routes/users.routes");
const resourcesRoutes = require("./routes/resources.routes");
const ratingsRoutes = require("./routes/ratings.routes");
const commentsRoutes = require("./routes/comments.routes");

// Функція ініціалізації схеми БД
///const { initDb } = require("./db/initDb");

const { runMigrations } = require("./db/migrate");

const app = express();
app.disable("x-powered-by"); /*прибирає з відповіді інформацію, що сервер працює на Express.*/

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff"); // забороняє браузеру самостійно “вгадувати” тип файлу.
    res.setHeader("X-Frame-Options", "DENY"); // забороняє відкривати сторінку у frame/iframe, що зменшує ризик clickjacking.
    res.setHeader("Referrer-Policy", "no-referrer"); // не передає адресу попередньої сторінки в інші запити.
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()"); // обмежує доступ до камери, мікрофона та геолокації.
    next();
});

/* КРИТЕРІЙ: працюючий Express-сервер із базовою структурою. */
/*app.use(cors());*/
/*app.use(express.json());*/

/*backend дозволяє запити тільки з цих адрес frontend*/
const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        /*сервер перевіряє, чи входить origin запиту у список дозволених*/
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS: origin is not allowed"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Demo-UserId"]
};

app.use(cors(corsOptions));
app.use(express.json());

/* ПІДКЛЮЧЕННЯ middleware логування */
app.use(logger);

/* Щоб на localhost:3000 відкривався frontend */
/*app.use(express.static(path.join(__dirname, "..")));*/

/*app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});*/

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

/* ПІДКЛЮЧЕННЯ ROUTES */
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/resources", resourcesRoutes);
app.use("/api/v1/ratings", ratingsRoutes);
app.use("/api/v1/comments", commentsRoutes);

/*тестовий endpoint 500 Internal Server Error*/
/*app.get("/api/v1/test-500", (req, res, next) => {
    next(new Error("Test server error"));
});*/

/* ПІДКЛЮЧЕННЯ централізованого обробника помилок */
app.use(errorHandler);

/*КРИТЕРІЙ: Сервер запускається локально.*/
const PORT = process.env.PORT || 3000;

async function bootstrap() {
    await runMigrations();

    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
}

// Якщо під час старту сталася критична помилка, сервер завершує роботу
bootstrap().catch((err) => {
    console.error("Fatal startup error:", err);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});