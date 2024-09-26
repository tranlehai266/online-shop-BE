const Product = require("../models/Product");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const productController = {};

productController.getProductByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const { sort } = req.query;

  // Tạo một đối tượng chứa các tiêu chí sắp xếp
  const sortOptions = {
    default: { createdAt: -1 },
    popularity: { popularity: -1 },
    rating: { rating: -1 },
    priceLowToHigh: { price: 1 },
    priceHighToLow: { price: -1 },
  };

  // Lấy tiêu chí sắp xếp, nếu không có sẽ mặc định là không sắp xếp
  const sortCriteria = sortOptions[sort] || {};

  const products = await Product.find({ category: categoryId })
    .populate("category")
    .sort(sortCriteria);

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
  const limit = parseInt(req.query.limit);

  const query = Product.find().populate("category");
  if (limit) {
    query.limit(limit);
  }

  const products = await query;

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

module.exports = productController;
