const express = require("express");
const {
  getProductByCategory,
  getAllProducts,
  getProductById,
} = require("../controllers/product.controller");
const router = express.Router();

router.get("/category/:categoryId", getProductByCategory);
router.get("/", getAllProducts);
router.get("/product/:productId", getProductById);

module.exports = router;
