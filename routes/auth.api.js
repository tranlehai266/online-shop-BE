const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
const { loginWithEmail } = require("../controllers/auth.controller");


// đăng nhập tài khoản
router.post(
  "/login",
  validators.validate([
    body("email", "Invalid Email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid Password").exists().notEmpty(),
  ]),
  loginWithEmail
);

module.exports = router;
