import { Router } from "express";
import { getUsers, getUserById, createUser, patchUser, deleteUser } from "../controllers/users.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.patch("/:id", patchUser);
router.put("/:id", patchUser);
router.delete("/:id", deleteUser);

export default router;