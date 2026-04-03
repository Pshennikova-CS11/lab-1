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

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/resources", resourcesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/ratings", ratingsRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "API is running" });
});

const publicPath = path.resolve("public");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.use(errorHandler);