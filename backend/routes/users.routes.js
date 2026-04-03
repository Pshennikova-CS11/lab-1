/* тільки опис маршрутів API */
const express = require("express");
const controller = require("../controllers/users.controller");

const router = express.Router();

/* CRUD-маршрути для сутності Users */
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;