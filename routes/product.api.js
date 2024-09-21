const express = require("express");
const { getProductByCategory } = require("../controllers/product.controller");
const router = express.Router();


/**
 * @route get /product-category/:categoryId
 * @description get product category , sort product
 * @params { categoryId, sort }
 */

router.get("/:categoryId", getProductByCategory);

module.exports = router;
