const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config({ path: "../.env" });

const client = new OAuth2Client(process.env.CLIENT_ID);

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  // get data from request
  const { email, password } = req.body;
  // validation
  const user = await User.findOne({ email }, "+password");

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
  sendResponse(res, 200, true, { user, accessToken }, null, "Login Success");
});

authController.googleLogin = catchAsync(async (req, res, next) => {
  const { googleToken } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.payload;

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = new User({
      name: payload.name,
      email: payload.email,
      isVerified: true,
    });
    await user.save();
  }

  const accessToken = await user.generateToken();

  sendResponse(res, 200, true, { user, accessToken }, null, "Login Success");
});

module.exports = authController;
