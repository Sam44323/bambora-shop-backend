const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: String,
  password: String,
  cart: [
    {
      type: String,
      default: [],
    },
  ],
  orders: [
    {
      type: String,
      default: [],
    },
  ],
});

module.exports = model('User', userSchema);
