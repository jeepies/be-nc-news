const express = require("express");
const controller = require("../server/controllers").articles;

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getByID);
router.patch("/:id", controller.updateArticle);
router.get("/:id/comments", controller.getCommentsByID);
router.post("/:id/comments", controller.addComment);

module.exports = router;
