const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
const {
  loginWithEmail,
  googleLogin,
} = require("../controllers/auth.controller");

// đăng nhập tài khoản , /auth/login
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

router.post("/google-login", googleLogin);

module.exports = router;
