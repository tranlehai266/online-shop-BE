const mongoose = require("mongoose");
const csv = require("csvtojson");
const Category = require("../models/Category");
require("dotenv").config({ path: "../.env" });

const createCategory = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    await mongoose.connect(mongoURI);
    console.log("Connected to Database!");

    const existingNames = new Set();
    let newData = await csv().fromFile("./data.csv");

    const categoriesToInsert = [];

    const desiredCategories = new Set([
      "Chairs",
      "Wardrobes",
      "Tables & desks",
      "Beds",
    ]); // Các danh mục bạn muốn

    newData.forEach((data) => {
      const categoryName = data.category;

      if (
        desiredCategories.has(categoryName) &&
        !existingNames.has(categoryName)
      ) {
        existingNames.add(categoryName);
        const imageUrl = `${process.env.BACKEND_URI}/images/${categoryName}.jpg`;
        categoriesToInsert.push({ name: categoryName, images: imageUrl });
      }
    });

    await Category.insertMany(categoriesToInsert);
  } catch (error) {
    console.log(error);
  }
};

createCategory();
