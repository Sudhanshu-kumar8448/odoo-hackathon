const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['Clothing', 'Electronics', 'Furniture'], required: true },
  price: { type: Number, required: true },
  imagePlaceholder: { type: String },
});

module.exports = mongoose.model('Product', productSchema);