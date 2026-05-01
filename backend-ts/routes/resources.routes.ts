import express from "express";
import {
    getAll,
    getById,
    create,
    update,
    remove,
    getWithDetails,
    getWithComments,
    getAvgRating
} from "../controllers/resources.controller";

const router = express.Router();

router.get("/", getAll);
router.get("/with-details", getWithDetails); //розширений запит, повертає розширені дані з кількох таблиць
router.get("/:id/comments", getWithComments); //оголошено endpoint, він приймає id ресурсу в URL і
                                              // використовується для отримання ресурсу разом із пов’язаними коментарями
router.get("/:id/rating", getAvgRating); //endpoint для отримання середнього рейтингу конкретного ресурсу
router.get("/:id", getById);

router.post("/", create);
router.patch("/:id", update);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;