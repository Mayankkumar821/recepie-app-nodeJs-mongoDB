
const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({
  name: String,
  description: String,
  ingredients: String
});
module.exports = mongoose.model('Recipe', recipeSchema);
