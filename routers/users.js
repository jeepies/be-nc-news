const express = require("express");
const controller = require("../server/controllers").users;

const router = express.Router();

router.get("/", controller.getAll)

module.exports = router;
