const express = require("express");
const {
  register,
  getProfile,
  updateProfile,
  verifyCode,
  resetPassword,
} = require("../controllers/user.controller");
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
const { loginRequired } = require("../middlewares/authentication");
const router = express.Router();

// đăng ký tài khoản, /users
router.post(
  "/register",
  validators.validate([
    body("name", "Invalid Name").exists().notEmpty(),
    body("email", "Invalid Email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid Password").exists().notEmpty(),
  ]),
  register
);
// đăng ký tài khoản /users
router.post("/verify-code", verifyCode);
// lấy tài khoản ,/users/profile
router.get("/profile", loginRequired, getProfile);
// reset mật khẩu
router.post("/reset-password", resetPassword);
router.put(
  "/update",
  validators.validate([
    body("name", "Invalid Name").optional().notEmpty(),
    body("email", "Invalid Email")
      .optional()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid Password").optional().notEmpty(),
    body("address", "Invalid Address").optional().notEmpty(),
    body("contact", "Invalid Contact").optional().notEmpty(),
  ]),
  loginRequired,
  updateProfile
);

module.exports = router;
