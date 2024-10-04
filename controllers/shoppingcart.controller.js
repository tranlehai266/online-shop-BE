const ShoppingCart = require("../models/ShoppingCart");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");

const shoppingCartController = {};

shoppingCartController.getUserCart = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  let shoppingCart = await ShoppingCart.findOne({
    user_id: userId,
    status: "active",
  }).populate({
    path: "items",
    populate: {
      path: "product",
      model: "Product",
    },
  });

  if (!shoppingCart) {
    shoppingCart = await ShoppingCart.create({ user_id: userId || null });
  }

  sendResponse(res, 200, true, shoppingCart, null, "Success");
});

shoppingCartController.completePayment = catchAsync(async (req, res, next) => {
  const { orderID, shippingAddress } = req.body;
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "Error ShoppingCart", "User not found");
  }

  if (!orderID) {
    throw new AppError(400, "Error ShoppingCart", "Not Found Shoppingcart");
  }

  let shoppingCart = await ShoppingCart.findOneAndUpdate(
    { user_id: userId, status: "active" },
    { status: "completed", orderId: orderID, shippingAddress: user.address },
    { new: true }
  );

  if (!shoppingCart) {
    throw new AppError(400, "Error ShoppingCart", "Not Found Shoppingcart");
  }

  sendResponse(
    res,
    200,
    true,
    shoppingCart,
    null,
    "Payment successful, shopping cart has been completed"
  );
});

shoppingCartController.getShoppingCartsByStatus = catchAsync(
  async (req, res, next) => {
    const userId = req.userId;

    const shoppingCarts = await ShoppingCart.find({ user_id: userId }).populate(
      {
        path: "items",
        populate: {
          path: "product",
          model: "Product",
        },
      }
    );

    if (!shoppingCarts.length) {
      throw new AppError(
        404,
        "ShoppingCarts not found",
        "No shopping carts found for this user"
      );
    }

    sendResponse(
      res,
      200,
      true,
      shoppingCarts,
      null,
      "Shopping carts retrieved successfully"
    );
  }
);

module.exports = shoppingCartController;
