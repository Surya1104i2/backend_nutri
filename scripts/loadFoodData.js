const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const csv = require("csv-parser");
const FoodItem = require("../models/Fooditem");

mongoose.connect("mongodb://localhost:27017/fitness-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected.");

  const filePath = path.join(__dirname, "../data/Veg weight gain - Veg breakfast.csv");
  const rows = [];

  // Step 1: Read CSV and collect rows
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      console.log(`✅ CSV read complete. Processing ${rows.length} rows...`);

      // Step 2: Process rows sequentially
      for (const row of rows) {
        const protein = Number(row["Protein"].replace(/[^0-9.]/g, ""));
        const foodData = {
          name: row.Name,
          calories: Number(row.Calories),
          protein: protein,
          image_url: row.Image || "",
        };

        try {
          await FoodItem.updateOne(
            { name: foodData.name },
            { $set: foodData },
            { upsert: true }
          );
          console.log(`✔️  Upserted: ${foodData.name}`);
        } catch (err) {
          console.error(`❌ Failed for ${foodData.name}:`, err.message);
        }
      }

      console.log("✅ All food items processed.");
      mongoose.connection.close();
    });
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});
