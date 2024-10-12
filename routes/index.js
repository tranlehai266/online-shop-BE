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
// productAPI
const productApi = require("./product.api");
router.use("/products", productApi);
// cartAPI
const cartApi = require("./cart.api");
router.use("/cart", cartApi);
// shoppingCart API
const shoppingCart = require("./shoppingcart.api");
router.use("/shoppingcart", shoppingCart);
// admin api
const adminApi = require("./admin.api");
router.use("/admin", adminApi);
// comment APi
const commentApi = require("./comment.api");
router.use("/comment", commentApi);
module.exports = router;
