const mongoose = require("mongoose");
const csv = require("csvtojson");
const Product = require("../models/Product");
const Category = require("../models/Category");

const createProduct = async () => {
  try {
    const mongoURI = "mongodb+srv://admin:123@cluster0.bxgya.mongodb.net/";
    await mongoose.connect(mongoURI);
    console.log("Connected to Database!");

    const desiredCategories = new Set([
      "Chairs",
      "Wardrobes",
      "Tables & desks",
      "Beds",
    ]);

    // đếm số lượng sản phẩm cho từng danh mục
    const categoryCount = {
      Chairs: 0,
      Wardrobes: 0,
      "Tables & desks": 0,
      Beds: 0,
    };

    // Tập hợp để tránh trùng lặp tên sản phẩm
    const existingNames = new Set();
    let imageIndex = 1;
    const productsToInsert = [];

    const newData = await csv().fromFile("./data.csv");

    // Duyệt qua từng sản phẩm
    for (const data of newData) {
      const categoryName = data.category;
      const productName = data.name;

      // Kiểm tra nếu danh mục nằm trong `desiredCategories`, sản phẩm chưa vượt quá 20, và tên sản phẩm chưa tồn tại
      if (
        desiredCategories.has(categoryName) &&
        categoryCount[categoryName] < 20 &&
        !existingNames.has(productName) // Tránh trùng lặp tên
      ) {
        const category = await Category.findOne({ name: categoryName });
        const randomPopularity = Math.floor(Math.random() * 100);
        const randomRating = (Math.random() * 5).toFixed(1);
        const imageUrl = `http://localhost:5000/product-images/${imageIndex}.jpg`;

        // Tạo sản phẩm mới
        productsToInsert.push({
          name: productName,
          item_id: parseInt(data.item_id),
          price: parseFloat(data.price),
          old_price: data.old_price,
          description: data.short_description,
          image_url: imageUrl,
          rating: randomRating,
          popularity: randomPopularity,
          category: category._id,
        });

        categoryCount[categoryName]++;
        existingNames.add(productName);
        imageIndex++;
      }
    }
    console.log(productsToInsert);
    await Product.insertMany(productsToInsert);
    console.log("Products added to the database:", productsToInsert);
  } catch (error) {
    console.log(error);
  }
};

createProduct();
