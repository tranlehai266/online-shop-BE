const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../middlewares/sendmail");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const userController = {};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) throw new AppError(400, "User already exists", "Register Error");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const verificationCode = generateVerificationCode();

  const token = jwt.sign(
    { name, email, hashedPassword, verificationCode },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

  await sendMail(
    email,
    "Verified Account Funio ✔",
    `<html>
    <body>
      <h1>Mã xác thực của bạn là: ${verificationCode}</h1>
      <h4>Vui lòng sử dụng mã này để xác thực tài khoản của bạn.</h4>
    </body>
  </html>`
  );
  sendResponse(
    res,
    200,
    true,
    { token, verificationCode },
    null,
    "Đã gửi email xác thực. Vui lòng kiểm tra hộp thư của bạn."
  );
});

userController.verifyCode = catchAsync(async (req, res, next) => {
  const { code, token } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const { name, email, hashedPassword, verificationCode } = decoded;

  if (code !== verificationCode) {
    throw new AppError(400, "Mã xác thực không đúng", "Verification Error");
  }

  let user = await User.create({
    email,
    name,
    password: hashedPassword,
    isVerified: true,
  });

  sendResponse(
    res,
    200,
    true,
    { user },
    null,
    "Tài khoản đã được xác thực thành công."
  );
});

userController.getProfile = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(404, "User not found", "Get Profile Error");

  sendResponse(res, 200, true, user, null, "Get Profile Success");
});

userController.updateProfile = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { name, email, password, address, contact } = req.body;

  let user = await User.findById(currentUserId);
  if (!user) throw new AppError(404, "User not found", "Update Profile Error");

  if (name) user.name = name;
  if (email) user.email = email;
  if (address) user.address = address;
  if (contact) user.contact = contact;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  await user.save();
  sendResponse(res, 200, true, user, null, "Profile updated successfully");
});

module.exports = userController;
