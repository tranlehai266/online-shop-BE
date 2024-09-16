const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  // get data from request
  let { name, email, password } = req.body;
  // validation
  let user = await User.findOne({ email });
  if (user) throw new AppError(400, "User already exits", "Register Error");
  // process
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({ name, email, password });
  const accessToken = await user.generateToken();
  // response
  sendResponse(res, 200, true, { user, accessToken }, null, "Register success");
});

module.exports = userController;
