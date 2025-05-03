/**
 * Utility to calculate calories using the Mifflin-St. Jeor formula
 * This formula is considered the most accurate for most people
 */

// Activity level multipliers
const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  lightly: 1.375,
  moderately: 1.55,
  very: 1.725,
  extremely: 1.9
};

// Mifflin-St. Jeor Equation
const calculateMifflinStJeorBMR = (gender, weight, height, age) => {
  // Uses metric units directly
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

// Calculate daily calorie needs and various targets
const calculateDailyCalories = (bmr, activityLevel) => {
  const factor = ACTIVITY_FACTORS[activityLevel];
  const maintenance = Math.round(bmr * factor);
  
  return {
    bmr: Math.round(bmr),
    maintenance: maintenance,
    weightLoss: Math.round(maintenance * 0.8), // 20% deficit for weight loss
    weightGain: Math.round(maintenance * 1.15) // 15% surplus for weight gain
  };
};

// Main function to calculate calories
const calculateCalories = (gender, age, height, weight, activityLevel) => {
  // Calculate BMR using Mifflin-St. Jeor (most accurate formula)
  const bmr = calculateMifflinStJeorBMR(gender, weight, height, age);
  const calorieResults = calculateDailyCalories(bmr, activityLevel);
  
  return calorieResults;
};

module.exports = {
  calculateCalories
};