const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  cart: [
    {
      prodId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        require: true,
      },
      qty: Number,
    },
  ],
  orders: [
    {
      name: String,
      qty: Number,
      amount: Number,
    },
  ],
});

module.exports = model("User", userSchema);
