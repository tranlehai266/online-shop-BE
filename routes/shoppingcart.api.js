const express = require("express");
const {
  getUserCart,
  completePayment,
  getShoppingCartsByStatus,
} = require("../controllers/shoppingcart.controller");
const { loginRequired } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", loginRequired, getUserCart);
router.put("/payment", loginRequired, completePayment);
router.get("/shopping", loginRequired, getShoppingCartsByStatus);
module.exports = router;
