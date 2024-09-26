const express = require("express");
const { loginRequired } = require("../middlewares/authentication");
const {
  addToCart,
  updateQuantity,
  deleteCartItem,
} = require("../controllers/cart.controller");
const router = express.Router();

router.post("/items", addToCart);
router.put("/items", updateQuantity);
router.delete("/items", deleteCartItem);

module.exports = router;
