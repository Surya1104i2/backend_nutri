const express = require("express");
const router = express.Router();
const FoodItem = require("../models/Fooditem");


// fetch("/api/food-items?type=veg_weightgain&meal=breakfast");


router.get("/food-items", async (req, res) => {
  try {
    const { type, meal } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (meal) filter.mealType = meal.toLowerCase();
     console.log(type,meal)
    const items = await FoodItem.find(filter);
    // console.log(items );
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch food items" });
  }
});

module.exports = router;
