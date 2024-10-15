const express = require("express");
const controller = require("../server/controllers").comments;

const router = express.Router();

router.delete("/:id", controller.delete)

module.exports = router;
