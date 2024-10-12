const User = require("../models/User");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const ShoppingCart = require("../models/ShoppingCart");
const Product = require("../models/Product");
const Category = require("../models/Category");
const { sendMail } = require("../middlewares/sendmail");
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

  const othersCategory = await Category.findOne({ name: "Others" });

  if (!othersCategory) {
    throw new AppError(
      404,
      "'Others' category not found",
      "Delete Category Error"
    );
  }

  await Product.updateMany({ category: id }, { category: othersCategory._id });

  sendResponse(res, 200, true, null, null, "Category deleted successfully.");
});

adminController.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, old_price, image_url, popularity, rating } = req.body;

  const updateData = { name, price, old_price, image_url, popularity, rating };

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
  const { name, item_id, price, old_price, description, image_url, category } =
    req.body;

  if (!name || !item_id || !price || !description || !category) {
    throw new AppError(400, "Missing required fields", "Create Product Error");
  }

  const existingProduct = await Product.findOne({ item_id, isDeleted: false });
  if (existingProduct) {
    throw new AppError(
      400,
      "Product with this item_id already exists",
      "Create Product Error"
    );
  }

  const newProduct = await Product.create({
    name,
    item_id,
    price,
    old_price,
    description,
    image_url: image_url || [],
    category,
  });

  sendResponse(
    res,
    200,
    true,
    newProduct,
    null,
    "Product created successfully."
  );
});

adminController.sendMail = catchAsync(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    throw new AppError(400, "All fields are required", "Send Mail Error");
  }

  const subject = `Message from ${name}`;
  const text = `You have received a new message from ${name} (${email}):\n\n${message}`;
  await sendMail("tranlehai2662000@gmail.com", subject, text);

  sendResponse(res, 200, true, null, null, "Email sent successfully.");
});

adminController.getCartDataForChart = catchAsync(async (req, res, next) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const completedCarts = await ShoppingCart.find({
    status: "completed",
    updatedAt: { $gte: threeMonthsAgo },
  })
    .populate("user_id", "name email")
    .populate({
      path: "items",
      populate: {
        path: "product",
        select: "name price",
      },
    });

  if (!completedCarts || completedCarts.length === 0) {
    throw new AppError(
      404,
      "Không tìm thấy giỏ hàng hoàn thành",
      "Lỗi lấy dữ liệu biểu đồ"
    );
  }

  const chartData = completedCarts.reduce((acc, cart) => {
    const monthYear = `${cart.updatedAt.getFullYear()}-${
      cart.updatedAt.getMonth() + 1
    }`; // năm vs tháng
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    if (!acc[monthYear]) {
      acc[monthYear] = { count: 0, totalAmount: 0 };
    }
    acc[monthYear].count += 1;
    acc[monthYear].totalAmount += totalAmount;

    return acc;
  }, {});

  const chartDataArray = Object.entries(chartData).map(([monthYear, data]) => ({
    month: monthYear, // Tháng và năm
    count: data.count, // Số lượng giỏ hàng hoàn thành
    totalAmount: data.totalAmount, // Tổng tiền cho tháng đó
  }));

  sendResponse(
    res,
    200,
    true,
    chartDataArray,
    null,
    "Lấy dữ liệu biểu đồ giỏ hàng hoàn thành thành công."
  );
});

module.exports = adminController;
