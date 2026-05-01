import { Router } from "express";
import { getRatings, getRatingById, createRating, patchRating, deleteRating} from "../controllers/ratings.controller";
import { validateBody } from "../middleware/validate";
import { validateCreateRating, validatePatchRating } from "../validators/ratings.validator";

const router = Router();

router.get("/", getRatings);
router.get("/:id", getRatingById);
router.post("/", validateBody(validateCreateRating), createRating);
router.patch("/:id", validateBody(validatePatchRating), patchRating);
router.put("/:id", validateBody(validatePatchRating), patchRating);
router.delete("/:id", deleteRating);

export default router;