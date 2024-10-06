const User = require("../models/User");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const ShoppingCart = require("../models/ShoppingCart");
const Product = require("../models/Product");
const Category = require("../models/Category");

const adminController = {};

adminController.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ isDeleted: false });
  sendResponse(res, 200, true, users, null, "Fetched all users successfully.");
});

adminController.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!user) {
    throw new AppError(404, "User not found", "Delete User Error");
  }

  sendResponse(res, 200, true, null, null, "User deleted successfully.");
});

adminController.getCartsByStatus = catchAsync(async (req, res, next) => {
  const { status } = req.query;

  if (!["active", "completed"].includes(status)) {
    throw new AppError(400, "Invalid status", "Get Carts Error");
  }

  const carts = await ShoppingCart.find({ status: status })
    .populate("user_id", "name email")
    .populate({
      path: "items",
      populate: {
        path: "product",
        select: "name price image_url",
      },
    });

  if (!carts || carts.length === 0) {
    throw new AppError(
      404,
      `No ${status} shopping carts found`,
      "Get Carts Error"
    );
  }

  sendResponse(
    res,
    200,
    true,
    carts,
    null,
    "Fetched active shopping carts successfully."
  );
});

adminController.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!product) {
    throw new AppError(404, "Product not found", "Delete Product Error");
  }
  sendResponse(res, 200, true, null, null, "Product deleted successfully.");
});

adminController.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!category) {
    throw new AppError(404, "Category not found", "Delete Category Error");
  }
  sendResponse(res, 200, true, null, null, "Category deleted successfully.");
});

module.exports = adminController;
