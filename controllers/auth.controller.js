const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  // get data from request
  const { email, password } = req.body;
  // validation
  const user = await User.findOne({ email }, "+password");
  console.log(user);
  if (!user)
    throw new AppError(
      400,
      "The account is not registered or verified",
      "Login Error"
    );
  // process
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "Wrong Password", "Login Error");

  const accessToken = await user.generateToken();
  console.log(accessToken);
  sendResponse(res, 200, true, { user, accessToken }, null, "Login Success");
});

module.exports = authController;
