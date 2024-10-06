const express = require("express");
const {
  getAllUsers,
  deleteUser,
  getCartsByStatus,
  deleteProduct,
  deleteCategory,
} = require("../controllers/admin.controller");
const router = express.Router();

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/cart", getCartsByStatus);
router.delete("/product/:id", deleteProduct);
router.delete("/category/:id", deleteCategory);
module.exports = router;
