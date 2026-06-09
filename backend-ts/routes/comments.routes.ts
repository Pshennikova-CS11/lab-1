import { Router } from "express";
import {
    getComments,
    getCommentById,
    createComment,
    patchComment,
    deleteComment
} from "../controllers/comments.controller";
import { demoAuth } from "../middleware/demoAuth";

const router = Router();

router.get("/", getComments);

router.get("/:id", demoAuth, getCommentById);
router.post("/", demoAuth, createComment);
router.patch("/:id", demoAuth, patchComment);
router.put("/:id", demoAuth, patchComment);
router.delete("/:id", demoAuth, deleteComment);

export default router;