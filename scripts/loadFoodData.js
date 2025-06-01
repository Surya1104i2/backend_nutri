// const fs = require("fs");
// const path = require("path");
// const mongoose = require("mongoose");
// const csv = require("csv-parser");
// const FoodItem = require("../models/Fooditem");

// mongoose.connect("mongodb://localhost:27017/fitness-app", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const loadCSV = (filename, type) => {
//   const filePath = path.join(__dirname, `../data/${filename}`);
//   const rows = [];

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on("data", (row) => rows.push(row))
//     .on("end", async () => {
//       console.log(`✅ Processing ${rows.length} rows from ${filename}...`);
//       for (const row of rows) {
//         try {
//           const foodData = {
//             name: row.Name,
//             calories: Number(row.Calories),
//             protein: Number(row.Protein.replace(/[^0-9.]/g, "")),
//             image_url: row.Image || "",
//             type,
//           };

//           await FoodItem.updateOne(
//             { name: foodData.name, type: foodData.type },
//             { $set: foodData },
//             { upsert: true }
//           );
//           console.log(`✔️ Upserted: ${foodData.name} (${type})`);
//         } catch (err) {
//           console.error(`❌ Error for ${row.Name}:`, err.message);
//         }
//       }

//       mongoose.connection.close();
//     });
// };

// const args = process.argv.slice(2);
// const fileMap = {
//   veg_weightgain: "Veg weight gain - Veg breakfast.csv",
//   veg_weightloss: "Veg weight loss - veg bf.csv",
//   nv_weightgain: "NV weight gain - NV breakfast.csv",
//   nv_weightloss: "NV weight loss - NV bf.csv",
// };

// const type = args[0]; // e.g., veg_weightgain
// const filename = fileMap[type];

// if (!filename) {
//   console.error("❌ Invalid type provided.");
//   mongoose.connection.close();
// } else {
//   loadCSV(filename, type);
// }


const xlsx = require("xlsx");
const path = require("path");
const mongoose = require("mongoose");
const FoodItem = require("../models/Fooditem");

mongoose.connect("mongodb+srv://Surya_prakash:Prakash_1104@cluster0.zhlkoc9.mongodb.net/food?retryWrites=true&w=majority&appName=food-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fileMap = {
  veg_weightgain: "Veg weight gain.xlsx",
  veg_weightloss: "Veg weight loss.xlsx",
  nv_weightgain: "NV weight gain.xlsx",
  nv_weightloss: "NV weight loss.xlsx",
};

const type = process.argv[2]; // e.g., veg_weightgain
const filename = fileMap[type];

if (!filename) {
  console.error("❌ Invalid type argument.");
  mongoose.connection.close();
  process.exit(1);
}

const filePath = path.join(__dirname, `../data2/${filename}`);
const workbook = xlsx.readFile(filePath);
const sheetNames = workbook.SheetNames;

(async () => {
  for (const mealType of sheetNames) {
    const sheet = workbook.Sheets[mealType];
    const rows = xlsx.utils.sheet_to_json(sheet);

    for (const row of rows) {
      try {
        const foodData = {
          name: row.Name?.trim(),
          calories: Number(row.Calories),
          protein: Number(String(row.Protein).replace(/[^0-9.]/g, "")),
          image_url: row.Image || "",
          type,
          mealType: mealType.toLowerCase(),
        };

        await FoodItem.updateOne(
          { name: foodData.name, type: foodData.type, mealType: foodData.mealType },
          { $set: foodData },
          { upsert: true }
        );

        console.log(`✔️ ${type} / ${mealType} → ${foodData.name}`);
      } catch (err) {
        console.error(`❌ Error for ${row.Name} in ${mealType}:`, err.message);
      }
    }
  }

  console.log("✅ All sheets processed.");
  mongoose.connection.close();
})();
