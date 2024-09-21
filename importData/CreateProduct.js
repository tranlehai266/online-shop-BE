const mongoose = require("mongoose");
const csv = require("csvtojson");
const Product = require("../models/Product");
const Category = require("../models/Category");

const createProduct = async () => {
  try {
    const mongoURI = "mongodb+srv://admin:123@cluster0.bxgya.mongodb.net/";
    await mongoose.connect(mongoURI);
    console.log("Connected to Database!");

    const existingName = new Set();
    let newData = await csv().fromFile("./data.csv");

    const uniqueProducts = [];

    for (const data of newData) {
      const nameData = data.name;

      if (!existingName.has(nameData)) {
        existingName.add(nameData);

        const category = await Category.findOne({ name: data.category });

        const randomPopularity = Math.floor(Math.random() * 100);
        const randomRating = (Math.random() * 5).toFixed(1);

        uniqueProducts.push({
          name: data.name,
          item_id: parseInt(data.item_id),
          price: parseFloat(data.price),
          old_price: data.old_price,
          description: data.short_description,
          image_url: [data.link],
          category: category._id,
          popularity: randomPopularity,
          rating: randomRating,
        });
      }
    }

    await Product.insertMany(uniqueProducts);
    console.log("Products added to the database:", uniqueProducts);
  } catch (error) {
    console.log(error);
  }
};

createProduct();
