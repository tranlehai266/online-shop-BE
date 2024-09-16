const express = require("express");
const { register } = require("../controllers/user.controller");
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
const router = express.Router();

// đăng ký tài khoản
router.post(
  "/",
  validators.validate([
    body("name", "Invalid Name").exists().notEmpty(),
    body("email", "Invalid Email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid Password").exists().notEmpty()
  ]),
  register
);
// lấy tài khoản


module.exports = router;
