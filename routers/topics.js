const express = require("express");
const controller = require("../server/controllers").topics;

const router = express.Router();

router.get("/", controller.getAll)
router.post("/", controller.create);

module.exports = router;