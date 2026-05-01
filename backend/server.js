const express = require("express");
// const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const path = require("path");

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

/* КРИТЕРІЙ: працюючий Express-сервер із базовою структурою. */
app.use(cors());
app.use(express.json());

/* ПІДКЛЮЧЕННЯ middleware логування */
app.use(logger);

/* Щоб на localhost:3000 відкривався frontend */
app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

/* ПІДКЛЮЧЕННЯ ROUTES */
app.use("/api/users", usersRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/comments", commentsRoutes);

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