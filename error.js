const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Surya_prakash:Prakash_1104@cluster0.zhlkoc9.mongodb.net/food?retryWrites=true&w=majority";

async function updateMealType() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("food");
    const result = await db.collection("fooditems").updateMany(
      { mealType: "lunch " },
      { $set: { mealType: "lunch" } }
    );
    console.log(`${result.modifiedCount} documents updated.`);
  } finally {
    await client.close();
  }
}

updateMealType();
