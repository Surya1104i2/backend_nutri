const express = require("express");
const router = express.Router();
const FoodItem = require("../models/Fooditem");

router.get("/food-items", async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch food items" });
  }
});

module.exports = router;
