const ShoppingCart = require("../models/ShoppingCart");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

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

module.exports = shoppingCartController;
