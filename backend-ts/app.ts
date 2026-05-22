import cors from "cors";
import express from "express";
import path from "path";

import resourcesRoutes from "./routes/resources.routes";
import usersRoutes from "./routes/users.routes";
import commentsRoutes from "./routes/comments.routes";
import ratingsRoutes from "./routes/ratings.routes";

import { errorHandler } from "./middleware/error-handler";
import { logger } from "./middleware/logger";

export const app = express();

const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS: origin is not allowed"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);

app.use("/api/v1/resources", resourcesRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/ratings", ratingsRoutes);

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

const publicPath = path.resolve("public");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.use(errorHandler);