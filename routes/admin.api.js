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
  sendMail,
} = require("../controllers/admin.controller");
const {
  loginRequired,
  adminRequired,
} = require("../middlewares/authentication");
const router = express.Router();

router.get("/users", loginRequired, adminRequired, getAllUsers);
router.delete("/users/:id", loginRequired, adminRequired, deleteUser);
router.get("/cart", loginRequired, adminRequired, getCartsByStatus);
router.delete("/product/:id", loginRequired, adminRequired, deleteProduct);
router.delete("/category/:id", loginRequired, adminRequired, deleteCategory);
router.put("/product/:id", loginRequired, adminRequired, updateProduct);
router.put("/category/:id", loginRequired, adminRequired, updateCategory);
router.post("/category", loginRequired, adminRequired, createCategory);
router.post("/product", loginRequired, adminRequired, createProduct);
router.post("/contact", sendMail);
module.exports = router;
