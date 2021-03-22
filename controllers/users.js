const bcrypt = require("bcrypt");
const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");
const { errorCreator } = require("../errorCreator/errorCreator");
const stripe = require("stripe")(
  "sk_test_51IXt1SSGnPbEznxsmliUKLckPLdc1zqgp0Fe85lo7PhPE0OrexgHccIhnXBC3cCHSZPqcx1HZ0SUoeDj1PspyvFa00pjEgMQac"
);

const User = require("../models/users");
const { validationResult } = require("express-validator");

const addUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errorCreator(errors.errors[0].msg));
  }
  bcrypt
    .hash(req.body.password, 12)
    .then((password) => {
      const userObj = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        cart: [],
        orders: [],
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
  User.findByIdAndUpdate(req.userId, updatedValue)
    .then(() => res.status(201).json({ message: "Updated the user!" }))
    .catch((err) => {
      next(errorCreator("Can't update the user at this moment1"));
    });
};

const deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.userId)
    .then(() => res.status(204).json({ message: "Deleted an user!" }))
    .catch((err) => {
      next(errorCreator("Can't delete the user at this moment1"));
    });
};

const loginUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errorCreator(errors.errors[0].msg));
  }
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
  User.findById(req.userId)
    .populate({
      path: "cart",
      populate: {
        path: "prodId",
      },
    })
    .select({ cart: 1, _id: 0 })
    .then((cart) => {
      if (cart.cart) {
        res.status(200).json({ cart: cart.cart });
      }
    })
    .catch((err) => {
      next(errorCreator("Please try after some time!"));
    });
};

const cartAction = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      const findIndex = user.cart.findIndex(
        (item) => item.prodId.toString() === req.params.id
      );

      if (findIndex >= 0) {
        user.cart[findIndex].qty += 1;
      } else {
        user.cart.push({
          prodId: ObjectID(req.params.id),
          qty: 1,
        });
      }
      return user.save();
    })
    .then((response) => {
      res.status(200).json({ message: "Added to cart!" });
    })
    .catch((err) => {
      next(errorCreator("Please try again!"));
    });
};

const incDcrCart = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      user.cart = user.cart.map((item) => {
        if (req.query.type === "inc") {
          item.qty = item.qty + 1;
        } else {
          item.qty = item.qty - 1;
        }
        return item;
      });
      user.cart = user.cart.filter((item) => item.qty !== 0);
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "Updated the cart" });
    })
    .catch((err) => {
      next(errorCreator("Please try again!"));
    });
};

//method for removing an item from the cart

const removeFromCart = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        return next(errorCreator("No such user found1"));
      }

      user.cart = user.cart.filter(
        (item) => item._id.toString() !== req.params.id.toString()
      );

      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "Removed from cart!" });
    })
    .catch((err) => {
      next(errorCreator("Please try after some time!"));
    });
};

const getOrders = (req, res, next) => {
  User.findById(req.userId)
    .select({ orders: 1, _id: 0 })
    .then((orders) => {
      if (orders.orders) {
        res.status(200).json({ orders: orders.orders });
      }
    })
    .catch((err) => {
      next(errorCreator("Please try after some time!"));
    });
};

const getStripeSession = (req, res, next) => {
  User.findById(req.userId)
    .populate({
      path: "cart",
      populate: {
        path: "prodId",
      },
    })
    .select({ cart: 1, _id: 0 })
    .then((cart) => {
      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cart.cart.map((item) => ({
          name: item.prodId.name,
          description: item.prodId.description,
          amount: item.prodId.amount * 100,
          currency: "usd",
          quantity: item.qty,
        })),
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:/failPayment",
      });
    })
    .then((session) => {
      res.status(200).json({ session });
    })
    .catch((err) => {
      next(errorCreator("Please try again!"));
    });
};

const placeOrder = (req, res, next) => {
  User.findById(req.userId)
    .populate({
      path: "cart",
      populate: {
        path: "prodId",
      },
    })
    .then((user) => {
      const orders = [];
      for (let item of user.cart) {
        orders.push({
          name: item.prodId.name,
          qty: item.qty,
          amount: item.prodId.amount * item.qty,
        });
      }
      user.cart = [];
      user.orders = orders;
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "Placed your order!" });
    })
    .catch((err) => {
      next(errorCreator("Can't place your order at this moment!"));
    });
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  getStripeSession,
  loginUser,
  getCart,
  cartAction,
  incDcrCart,
  removeFromCart,
  placeOrder,
  getOrders,
};
