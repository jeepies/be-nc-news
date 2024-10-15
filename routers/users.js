const express = require("express");
const controller = require("../server/controllers").users;

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:username", controller.getByUsername);

module.exports = router;
