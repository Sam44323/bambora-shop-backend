const { Schema, model } = require('mongoose');

const prodSchema = new Schema({
  name: String,
  amount: Number,
  image: String,
  creatorId: String,
});

module.exports = model('Product', prodSchema);
