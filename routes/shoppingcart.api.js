const express = require("express");
const { getUserCart } = require("../controllers/shoppingcart.controller");
const { loginRequired } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", loginRequired, getUserCart);

module.exports = router;
