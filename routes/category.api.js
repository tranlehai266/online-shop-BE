const express = require("express");
const { getCategory } = require("../controllers/category.controller");
const router = express.Router();

/**
 * @route get /categories
 * @description get category
 * @params { null }
 * @body { null }
 */

router.get("/", getCategory);
module.exports = router;
