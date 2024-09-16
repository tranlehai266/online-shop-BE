var express = require("express");
var router = express.Router();

// authAPI
const authApi = require("./auth.api");
router.use("/auth", authApi);
// userAPI
const userApi = require("./user.api");
router.use("/users", userApi);

module.exports = router;
