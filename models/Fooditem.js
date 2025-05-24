const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  protein: Number,
  image_url: String, // optional
});

module.exports = mongoose.model("FoodItem", foodItemSchema);
