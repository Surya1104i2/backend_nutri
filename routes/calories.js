const express = require('express'); 
const User = require('../models/user');
const calorieCalculator = require('../utils/caloriesCal');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 🔐 Create a new user profile (requires auth)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, age, gender, height, weight, activityLevel } = req.body;

    const calorieResults = calorieCalculator.calculateCalories(
      gender, 
      age, 
      height, 
      weight, 
      activityLevel || 'moderately'
    );

   // Check if user data already exists
const existingUser = await User.findOne({ user: req.user.id });

if (existingUser) {
  // Update existing user data
  existingUser.name = name;
  existingUser.age = age;
  existingUser.gender = gender;
  existingUser.height = height;
  existingUser.weight = weight;
  existingUser.activityLevel = activityLevel || 'moderately';
  existingUser.calorieResults = calorieResults;

  const updatedUser = await existingUser.save();
  return res.status(200).json(updatedUser);
} else {
  // Create new user record
  const newUser = new User({
    user: req.user.id,
    name,
    age,
    gender,
    height,
    weight,
    activityLevel: activityLevel || 'moderately',
    calorieResults
  });

  const savedUser = await newUser.save();
  return res.status(201).json(savedUser);
}
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🟢 Calculate calories without saving (public route)
router.post('/calculate-calories', (req, res) => {
  try {
    const { gender, age, height, weight, activityLevel } = req.body;

    if (!gender || !age || !height || !weight) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const calorieResults = calorieCalculator.calculateCalories(
      gender, 
      age, 
      height, 
      weight, 
      activityLevel || 'moderately'
    );

    res.status(200).json(calorieResults);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// 🔐 Get user by ID (requires auth)
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log(req.user.findOne);
    const user = await User.findOne({user: req.user.id});
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
