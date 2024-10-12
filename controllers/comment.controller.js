const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Comment = require("../models/Comment");
const Product = require("../models/Product");
const User = require("../models/User");

const commentController = {};

commentController.addComment = catchAsync(async (req, res, next) => {
  const { productId, content } = req.body;
  const userId = req.userId;

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(400, "Product Not Found", "Không tìm thấy sản phẩm");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, "User Not Found", "Không tìm thấy người dùng");
  }

  const comment = await Comment.create({
    productId,
    userId,
    content,
  });

  const populatedComment = await comment.populate("userId", "name");

  sendResponse(
    res,
    201,
    true,
    populatedComment,
    null,
    "Comment added successfully"
  );
});
commentController.getCommentsByProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const comments = await Comment.find({ productId }).populate("userId", "name");
  if (!comments) {
    throw new AppError(
      404,
      "No comments found",
      "Không tìm thấy bình luận nào"
    );
  }
  sendResponse(
    res,
    200,
    true,
    comments,
    null,
    "Comments retrieved successfully"
  );
});

module.exports = commentController;
