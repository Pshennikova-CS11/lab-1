const express = require("express");
const router = express.Router();

const demoAuth = require("../middleware/demoAuth");

const {
    getAll,
    getById,
    create,
    update,
    remove
} = require("../controllers/comments.controller");

router.get("/", getAll);
router.get("/:id", demoAuth, getById);
router.post("/", demoAuth, create);
router.put("/:id", demoAuth, update);
router.delete("/:id", demoAuth, remove);

module.exports = router;