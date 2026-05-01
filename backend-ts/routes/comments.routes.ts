import { Router } from "express";
import { getComments, getCommentById, createComment, patchComment, deleteComment} from "../controllers/comments.controller";

const router = Router();

router.get("/", getComments);
router.get("/:id", getCommentById);
router.post("/", createComment);
router.patch("/:id", patchComment);
router.put("/:id", patchComment);
router.delete("/:id", deleteComment);

export default router;