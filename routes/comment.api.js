const express = require("express");
const {
  addComment,
  getCommentsByProduct,
} = require("../controllers/comment.controller");
const { loginRequired } = require("../middlewares/authentication");
const router = express.Router();

router.post("/comments", loginRequired, addComment);
router.get("/comments/:productId", getCommentsByProduct);

module.exports = router;
