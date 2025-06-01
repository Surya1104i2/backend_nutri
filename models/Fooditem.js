const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  protein: Number,
  image_url: String,
  type: String,      // e.g., veg_weightgain
  mealType: String,  // e.g., breakfast
});

module.exports = mongoose.model("FoodItem", foodItemSchema);
