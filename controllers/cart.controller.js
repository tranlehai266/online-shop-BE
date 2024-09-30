const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const ShoppingCart = require("../models/ShoppingCart");

const cartController = {};

cartController.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity, userId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, "Sản phẩm không tồn tại", "Lỗi thêm vào giỏ hàng");
  }

  let shoppingCart = await ShoppingCart.findOne({
    user_id: userId,
    status: "active",
  }).populate("items");
  console.log(shoppingCart);
  
  if (!shoppingCart) {
    shoppingCart = await ShoppingCart.create({ userId, items: [] });
  }

  // kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingItems = shoppingCart.items.filter(
    (item) => item.product.toString() === productId.toString()
  );
  console.log("exist", existingItems);
  if (existingItems.length > 0) {
    // Nếu sản phẩm đã tồn tại, cập nhật số lượng
    const existingItem = existingItems[0]; // Lấy sản phẩm đã tồn tại
    existingItem.quantity += quantity; // Cập nhật số lượng

    await existingItem.save(); // Lưu lại
  } else {
    // Nếu sản phẩm chưa tồn tại, thêm mới
    const cartItem = await CartItem.create({
      product: productId,
      quantity: quantity || 1,
      price: product.price,
    });

    shoppingCart.items.push(cartItem);
    await shoppingCart.save();
    console.log("shopping 47", shoppingCart);
    sendResponse(
      res,
      201,
      true,
      { cartItem },
      null,
      "Thêm vào giỏ hàng thành công"
    );
  }
});

cartController.updateQuantity = catchAsync(async (req, res, next) => {
  const { cartItemId, quantity } = req.body;

  if (quantity <= 0) {
    throw new AppError(400, "Số lượng không hợp lệ", "Lỗi cập nhật giỏ hàng");
  }

  const cartItem = await CartItem.findByIdAndUpdate(
    cartItemId,
    { quantity },
    { new: true }
  );

  if (!cartItem) {
    throw new AppError(404, "Mặt hàng không tồn tại", "Lỗi cập nhật giỏ hàng");
  }

  sendResponse(res, 200, true, cartItem, null, "Cập nhật số lượng thành công");
});

cartController.deleteCartItem = catchAsync(async (req, res, next) => {
  const { cartItemId } = req.body;

  if (!cartItemId) {
    throw new AppError(400, "Không tìm thấy mặt hàng", "Lỗi xóa giỏ hàng");
  }

  const cartItem = await CartItem.findByIdAndDelete(cartItemId);

  if (!cartItem) {
    throw new AppError(404, "Mặt hàng không tồn tại", "Lỗi xóa giỏ hàng");
  }

  sendResponse(res, 200, true, cartItem, null, "Delete Success");
});

module.exports = cartController;
