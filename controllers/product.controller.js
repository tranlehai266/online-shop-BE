const Product = require("../models/Product");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const productController = {};

productController.getProductByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const { sort, limit } = req.query;

  const sortOptions = {
    default: { createdAt: -1 },
    popularity: { popularity: -1 },
    rating: { rating: -1 },
    priceLowToHigh: { price: 1 },
    priceHighToLow: { price: -1 },
  };

  const sortCriteria = sortOptions[sort] || { createdAt: -1 };

  const limitProducts = parseInt(limit) || 10;

  const products = await Product.find({
    category: categoryId,
    isDeleted: false,
  })
    .populate("category")
    .sort(sortCriteria)
    .limit(limitProducts);

  if (!products || products.length === 0) {
    throw new AppError(400, "Not Found Product", "Nhập đúng product ");
  }

  sendResponse(
    res,
    200,
    true,
    products,
    null,
    "Products retrieved successfully"
  );
});

productController.getAllProducts = catchAsync(async (req, res, next) => {
  const { sort, limit, search } = req.query;

  const sortOptions = {
    default: { createdAt: -1 },
    popularity: { popularity: -1 },
    rating: { rating: -1 },
    priceLowToHigh: { price: 1 },
    priceHighToLow: { price: -1 },
  };

  const sortCriteria = sortOptions[sort] || {};
  const limitProducts = parseInt(limit);

  let query = { isDeleted: false };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  } else {
    query = { isDeleted: false };
  }

  const products = await Product.find(query)
    .populate("category")
    .sort(sortCriteria)
    .limit(limitProducts);

  if (!products || products.length === 0) {
    throw new AppError(400, "Not Found Product", "Không tìm thấy sản phẩm");
  }

  sendResponse(
    res,
    200,
    true,
    products,
    null,
    "All products retrieved successfully"
  );
});

productController.getProductById = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate("category");

  if (!product) {
    throw new AppError(400, "Product Not Found", "Không tìm thấy sản phẩm");
  }

  sendResponse(res, 200, true, product, null, "Product retrieved successfully");
});

module.exports = productController;
