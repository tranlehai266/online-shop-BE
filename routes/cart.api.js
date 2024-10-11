const express = require("express");
const { loginRequired } = require("../middlewares/authentication");
const {
  addToCart,
  updateQuantity,
  deleteCartItem,
} = require("../controllers/cart.controller");
const router = express.Router();

router.post("/items", loginRequired, addToCart);
router.put("/items", loginRequired, updateQuantity);
router.delete("/items", loginRequired, deleteCartItem);

module.exports = router;
