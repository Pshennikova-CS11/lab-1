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
exports.app.disable("x-powered-by");
exports.app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    next();
});
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
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("CORS: origin is not allowed"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Demo-UserId"]
};
exports.app.use((0, cors_1.default)(corsOptions));
exports.app.use(express_1.default.json());
exports.app.use(logger_1.logger);
exports.app.use("/api/v1/resources", resources_routes_1.default);
exports.app.use("/api/v1/users", users_routes_1.default);
exports.app.use("/api/v1/comments", comments_routes_1.default);
exports.app.use("/api/v1/ratings", ratings_routes_1.default);
exports.app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
const publicPath = path_1.default.resolve("public");
exports.app.use(express_1.default.static(publicPath));
exports.app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(publicPath, "index.html"));
});
exports.app.use(error_handler_1.errorHandler);
