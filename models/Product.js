const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    name: { type: String, required: true },
    item_id: { type: Number, required: true },
    price: { type: Number, required: true },
    old_price: { type: String, required: true },
    description: { type: String, required: true },
    image_url: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    popularity: { type: Number, required: false },
    rating: { type: Number, required: false },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
