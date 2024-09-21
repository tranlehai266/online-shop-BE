var express = require("express");
var router = express.Router();

// authAPI
const authApi = require("./auth.api");
router.use("/auth", authApi);
// userAPI
const userApi = require("./user.api");
router.use("/users", userApi);
// categoryAPI
const categoryApi = require("./category.api");
router.use("/categories", categoryApi);
// productAPi
const productApi = require("./product.api");
router.use("/product-category", productApi);

module.exports = router;
