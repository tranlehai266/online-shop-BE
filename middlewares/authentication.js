const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils");
const User = require("../models/User");

const authentication = {};

authentication.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;

    console.log("Authorization Header:", tokenString);

    if (!tokenString)
      throw new AppError(401, "Login Required", "Authentication Error");

    const token = tokenString.replace("Bearer ", "");

    console.log("Extracted Token:", token);

    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        console.log("JWT Error:", err);
        if (err.name === "TokenExpiredError") {
          throw new AppError(401, "Token Required", "Authentication Error");
        } else {
          throw new AppError(401, "Token is invalid", "Authentication Error");
        }
      }
      console.log(payload);
      req.userId = payload._id;
      next();
    });
  } catch (error) {
    next(error);
  }
};

authentication.adminRequired = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new AppError(401, "Login Required", "Authentication Error");
    }

    const user = await User.findById(req.userId);

    if (!user || user.isDeleted) {
      throw new AppError(
        403,
        "User not found or deactivated",
        "Authorization Error"
      );
    }

    if (user.role !== "admin") {
      throw new AppError(403, "Admin access required", "Authorization Error");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
