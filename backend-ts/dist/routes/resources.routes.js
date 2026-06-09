"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resources_controller_1 = require("../controllers/resources.controller");
const router = express_1.default.Router();
router.get("/", resources_controller_1.getAll);
router.get("/with-details", resources_controller_1.getWithDetails); //розширений запит, повертає розширені дані з кількох таблиць
router.get("/:id/comments", resources_controller_1.getWithComments); //оголошено endpoint, він приймає id ресурсу в URL і
// використовується для отримання ресурсу разом із пов’язаними коментарями
router.get("/:id/rating", resources_controller_1.getAvgRating); //endpoint для отримання середнього рейтингу конкретного ресурсу
router.get("/:id", resources_controller_1.getById);
router.post("/", resources_controller_1.create);
router.patch("/:id", resources_controller_1.update);
router.put("/:id", resources_controller_1.update);
router.delete("/:id", resources_controller_1.remove);
exports.default = router;
