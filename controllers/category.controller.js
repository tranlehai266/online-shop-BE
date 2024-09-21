const express = require("express");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const categoryController = {};

categoryController.getCategory = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  if (!categories || categories.length === 0) {
    return next(new AppError("No categories found", 404));
  }

  // Trả về phản hồi
  sendResponse(
    res,
    200,
    true,
    categories,
    null,
    "Categories retrieved successfully"
  );
});

module.exports = categoryController;
