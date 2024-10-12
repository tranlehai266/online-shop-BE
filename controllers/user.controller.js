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
  let { name, email, password, role } = req.body;
  let user = await User.findOne({ email });
  if (user) throw new AppError(400, "User already exists", "Register Error");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const verificationCode = generateVerificationCode();

  const token = jwt.sign(
    { name, email, hashedPassword, verificationCode, role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

  await sendMail(
    email,
    "Verified Account Funio ✔",
    null,
    `<h1>Your authentication code is: ${verificationCode}</h1>
    <h4>Please use this code to authenticate your account.</h4>`
  );
  sendResponse(
    res,
    200,
    true,
    { token, verificationCode },
    null,
    "Verification email sent. Please check your mailbox."
  );
});

userController.verifyCode = catchAsync(async (req, res, next) => {
  const { code, token } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const { name, email, hashedPassword, verificationCode, role } = decoded;

  if (code !== verificationCode) {
    throw new AppError(
      400,
      "Authentication code is incorrect",
      "Verification Error"
    );
  }

  let user = await User.create({
    email,
    name,
    password: hashedPassword,
    role: role || "user",
    isVerified: true,
  });

  sendResponse(
    res,
    200,
    true,
    { user },
    null,
    "The account has been successfully authenticated."
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

userController.resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  let user = await User.findOne({ email });
  if (!user)
    throw new AppError(404, "User does not exist", "Reset Password Error");

  // Tạo mật khẩu mới ngẫu nhiên
  const newPassword = Math.random().toString(36).slice(-8);

  // Mã hóa mật khẩu mới
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Cập nhật mật khẩu mới vào cơ sở dữ liệu
  user.password = hashedPassword;
  await user.save();

  // Gửi mật khẩu mới qua email
  await sendMail(
    email,
    "Reset Password Funio ✔",
    null,
    `<h1>Your new password is: ${newPassword}</h1>
     <h4>Please log in with this new password and change your password immediately.</h4>`
  );

  sendResponse(
    res,
    200,
    true,
    null,
    null,
    "New password has been sent to your email. Please check your mailbox."
  );
});

module.exports = userController;
