const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorCreator = require("../errorCreator/errorCreator");

const User = require("../models/users");

const addUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 12)
    .then((password) => {
      const userObj = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
      });
      return userObj.save();
    })
    .then(() => res.status(200).json({ message: "Added an user!" }))
    .catch((err) => {
      next(errorCreator("Can't create an user at this moment1"));
    });
};

const updateUser = (req, res, next) => {
  const updatedValue = {
    email: req.body.email,
  };
  User.findByIdAndUpdate(req.params.id, updatedValue)
    .then(() => res.status(201).json({ message: "Updated the user!" }))
    .catch((err) => {
      next(errorCreator("Can't update the user at this moment1"));
    });
};

const deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.body.id)
    .then(() => res.status(204).json({ message: "Deleted an user!" }))
    .catch((err) => {
      next(errorCreator("Can't delete the user at this moment1"));
    });
};

const loginUser = (req, res, next) => {
  let userData;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return next(errorCreator("User not found!"));
      }
      userData = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((isValid) => {
      if (!isValid) {
        return next(errorCreator("Please enter a valid password!"));
      }
      const token = jwt.sign(
        {
          email: userData.email,
          userId: userData._id,
          password: userData.password,
        },
        "BAMBORA-SHOP-SECRET",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({ token, userId: userData._id.toString() });
    })
    .catch((err) => {
      next(errorCreator("Please try to login after some time"));
    });
};

const getCart = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({ cart: user.cart });
      }
    })
    .catch((err) => {
      next(errorCreator("Please try after some time!"));
    });
};

const cartAction = (req, res, next) => {
  res.status(200).json({ message: "Added to the cart!" });
};

const getOrders = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      res.status(200).orders({ orders: user.orders });
    })
    .catch((err) => {
      next(errorCreator("Please try after some time!"));
    });
};

const placeOrder = (req, res, next) => {
  res.status(200).json({ message: "Placed the order!" });
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  getCart,
  cartAction,
  getOrders,
  placeOrder,
};
