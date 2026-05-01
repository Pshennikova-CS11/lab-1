"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const resources_routes_1 = __importDefault(require("./routes/resources.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const comments_routes_1 = __importDefault(require("./routes/comments.routes"));
const ratings_routes_1 = __importDefault(require("./routes/ratings.routes"));
const error_handler_1 = require("./middleware/error-handler");
const logger_1 = require("./middleware/logger");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(logger_1.logger);
exports.app.use("/api/resources", resources_routes_1.default);
exports.app.use("/api/users", users_routes_1.default);
exports.app.use("/api/comments", comments_routes_1.default);
exports.app.use("/api/ratings", ratings_routes_1.default);
exports.app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "API is running" });
});
const publicPath = path_1.default.resolve("public");
exports.app.use(express_1.default.static(publicPath));
exports.app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(publicPath, "index.html"));
});
exports.app.use(error_handler_1.errorHandler);
