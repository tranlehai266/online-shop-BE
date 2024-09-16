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
module.exports = userController;
