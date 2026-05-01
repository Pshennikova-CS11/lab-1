const express = require("express");
const router = express.Router();

const {
    getAll,
    getById,
    getWithComments,
    create,
    update,
    remove
} = require("../controllers/resources.controller");

router.get("/", getAll); // GET list
router.get("/:id/comments", getWithComments); // GET resource with comments (JOIN)
router.get("/:id", getById); // GET by id
router.post("/", create); // POST create
router.put("/:id", update); // PUT update
router.delete("/:id", remove); // DELETE

module.exports = router;