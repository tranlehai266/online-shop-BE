const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shoppingCartSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "CartItem" }],
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    shippingAddress: { type: String, required: false },
    orderId: { type: String, required: false },
  },
  { timestamps: true }
);

const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);
module.exports = ShoppingCart;
