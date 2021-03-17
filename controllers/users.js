const User = require('../models/users');

const addUser = (req, res, next) => {
  const userObj = new User({
    name: req.body.email,
    email: req.body.email,
    password: req.body.password,
  });
  userObj
    .save()
    .then(() => res.status(200).json({ message: 'Added an user!' }))
    .catch((err) => console.log(err));
};

const updateUser = (req, res, next) => {
  const updatedValue = {
    email: req.body.email,
  };
  User.findByIdAndUpdate(req.params.id, updatedValue)
    .then(() => res.status(201).json({ message: 'Updated the user!' }))
    .catch((err) => console.log(err));
};

const deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.body.id)
    .then(() => res.status(204).json({ message: 'Deleted an user!' }))
    .catch((err) => console.log(err));
};

const loginUser = (req, res, next) => {
  res.status(200).json({ message: 'You are logged in!' });
};

const cartAction = (req, res, next) => {
  res.status(200).json({ message: 'Added to the cart!' });
};

const placeOrder = (req, res, next) => {
  res.status(200).json({ message: 'Placed the order!' });
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  cartAction,
  placeOrder,
};
