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

adminController.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, old_price, image_url, popularity, rating } = req.body;

  const updateData = { name, price, old_price, image_url, popularity, rating };

  console.log("UpdateData", updateData);

  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!product) {
    throw new AppError(404, "Product not found", "Update Product Error");
  }

  sendResponse(res, 200, true, product, null, "Product updated successfully.");
});

adminController.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, images } = req.body;

  const updateData = { name, images };

  const category = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!category) {
    throw new AppError(404, "Category not found", "Update Category Error");
  }

  sendResponse(
    res,
    200,
    true,
    category,
    null,
    "Category updated successfully."
  );
});

adminController.createCategory = catchAsync(async (req, res, next) => {
  const { name, images } = req.body;

  if (!name) {
    throw new AppError(
      400,
      "Category name is required",
      "Create Category Error"
    );
  }

  const existingCategory = await Category.findOne({ name, isDeleted: false });
  if (existingCategory) {
    throw new AppError(
      400,
      "Category with this name already exists",
      "Create Category Error"
    );
  }

  // Create new category
  const newCategory = await Category.create({
    name,
    images: images || [],
  });

  sendResponse(
    res,
    200,
    true,
    newCategory,
    null,
    "Category created successfully."
  );
});

adminController.createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    item_id,
    price,
    old_price,
    description,
    image_url,
    category,
    popularity,
    rating,
  } = req.body;


  if (!name || !item_id || !price || !description || !category || !popularity || !rating) {
    throw new AppError(400, "Missing required fields", "Create Product Error");
  }

  
  const existingProduct = await Product.findOne({ item_id, isDeleted: false });
  if (existingProduct) {
    throw new AppError(400, "Product with this item_id already exists", "Create Product Error");
  }

  
  const newProduct = await Product.create({
    name,
    item_id,
    price,
    old_price,
    description,
    image_url: image_url || [],  
    category,
    popularity,
    rating,
  });

  sendResponse(res, 200, true, newProduct, null, "Product created successfully.");
});

module.exports = adminController;
