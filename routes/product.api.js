const express = require("express");
const {
  getProductByCategory,
  getAllProducts,
} = require("../controllers/product.controller");
const router = express.Router();

/**
 * @route get /product-category/:categoryId
 * @description get product category , sort product
 * @params { categoryId, sort }
 */

router.get("/:categoryId", getProductByCategory);
router.get("/", getAllProducts);

module.exports = router;
