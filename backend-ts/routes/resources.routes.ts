import { Router } from "express";
import {
    createResource,
    deleteResource,
    getResourceById,
    getResources,
    patchResource
} from "../controllers/resources.controller";
import { validateBody } from "../middleware/validate";
import { validateCreateResource, validatePatchResource } from "../validators/resources.validator";

const router = Router();

router.get("/", getResources);
router.get("/:id", getResourceById);
router.post("/", validateBody(validateCreateResource), createResource);
router.patch("/:id", validateBody(validatePatchResource), patchResource);
router.delete("/:id", deleteResource);

export default router;