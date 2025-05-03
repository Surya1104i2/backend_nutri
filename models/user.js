const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth'             // works as foriegn key for the user.js file
},
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  height: {
    type: Number,
    required: true,
    comment: 'Height in cm'
  },
  weight: {
    type: Number,
    required: true,
    comment: 'Weight in kg'
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly', 'moderately', 'very', 'extremely'],
    default: 'moderately'
  },
  calorieResults: {
    bmr: Number,
    maintenance: Number,
    weightLoss: Number,
    weightGain: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);