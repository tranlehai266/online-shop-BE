const fs = require("fs");
const mongoose = require("mongoose");
const csv = require("csvtojson");
const Category = require("../models/Category");

const createCategory = async () => {
  try {
    const mongoURI = "mongodb+srv://admin:123@cluster0.bxgya.mongodb.net/";

    await mongoose.connect(mongoURI);
    console.log("Connected to Database!");

    const existingNames = new Set();
    let newData = await csv().fromFile("./data.csv");

    const categoriesToInsert = [];

    newData.forEach((data) => {
      const categoryName = data.category;

      if (!existingNames.has(categoryName)) {
        existingNames.add(categoryName);
        categoriesToInsert.push({ name: categoryName });
      }
    });

    await Category.insertMany(categoriesToInsert);
    console.log("Categories inserted successfully!");
  } catch (error) {
    console.log(error);
  }
};

createCategory();
