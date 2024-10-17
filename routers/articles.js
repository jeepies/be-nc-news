const express = require("express");
const controller = require("../server/controllers").articles;

const router = express.Router();

router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/:id", controller.getByID);
router.patch("/:id", controller.updateArticle);
router.get("/:id/comments", controller.getCommentsByID);
router.post("/:id/comments", controller.addComment);
router.delete("/:id", controller.delete);

module.exports = router;
