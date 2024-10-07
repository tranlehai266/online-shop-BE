const express = require("express");
const {
  getAllUsers,
  deleteUser,
  getCartsByStatus,
  deleteProduct,
  deleteCategory,
  updateProduct,
  updateCategory,
  createCategory,
  createProduct,
} = require("../controllers/admin.controller");
const router = express.Router();

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/cart", getCartsByStatus);
router.delete("/product/:id", deleteProduct);
router.delete("/category/:id", deleteCategory);
router.put("/product/:id", updateProduct);
router.put("/category/:id", updateCategory);
router.post("/category", createCategory);
router.post("/product", createProduct)
module.exports = router;
