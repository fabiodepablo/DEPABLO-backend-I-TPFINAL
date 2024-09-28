const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  available: Boolean
});

module.exports = mongoose.model('Product', ProductSchema);
