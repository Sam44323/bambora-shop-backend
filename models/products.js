const { Schema, model } = require("mongoose");

const prodSchema = new Schema({
  name: String,
  amount: Number,
  image: String,
  description: String,
  creatorId: Schema.Types.ObjectId,
});

module.exports = model("Product", prodSchema);
