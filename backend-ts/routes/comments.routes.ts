import { Router } from "express";
import {
    createComment,
    deleteComment,
    getCommentById,
    getComments,
    patchComment
} from "../controllers/comments.controller";
import { validateBody } from "../middleware/validate";
import { validateCreateComment, validatePatchComment } from "../validators/comments.validator";

const router = Router();

router.get("/", getComments);
router.get("/:id", getCommentById);
router.post("/", validateBody(validateCreateComment), createComment);
router.patch("/:id", validateBody(validatePatchComment), patchComment);
router.delete("/:id", deleteComment);

export default router;