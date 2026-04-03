import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUserById,
    getUsers,
    patchUser
} from "../controllers/users.controller";
import { validateBody } from "../middleware/validate";
import { validateCreateUser, validatePatchUser } from "../validators/users.validator";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", validateBody(validateCreateUser), createUser);
router.patch("/:id", validateBody(validatePatchUser), patchUser);
router.delete("/:id", deleteUser);

export default router;