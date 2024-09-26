const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;
