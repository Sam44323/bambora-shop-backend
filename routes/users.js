const { Router } = require("express");
const { body } = require("express-validator");

const router = Router();
const userControllers = require("../controllers/users");
const { checkAuthenticated } = require("../middleware/authMiddleware");

// ADDING A NEW USER
router.post(
  "/add-user",
  checkAuthenticated,
  [
    body("name").notEmpty().withMessage("Please enter your name!"),
    body("email").isEmail().withMessage("Please enter a valid email!"),
    body("password")
      .isStrongPassword({ minLength: 5 })
      .withMessage("Please enter a password of at-least 5 character!"),
  ],
  userControllers.addUser
);

//UPDATE AN USER
router.patch(
  "/update-user/:id",
  checkAuthenticated,
  [
    body("name").notEmpty().withMessage("Please enter your name!"),
    body("email").isEmail().withMessage("Please enter a valid email!"),
    body("password")
      .isStrongPassword({ minLength: 5 })
      .withMessage("Please enter a password of at-least 5 character!"),
  ],
  userControllers.updateUser
);

// DELETING A USER
router.delete("/delete-user", checkAuthenticated, userControllers.deleteUser);

// LOGIN THE USER
router.post("/login-user", userControllers.loginUser);

//GETTING THE CART ITEMS
router.get("/cart", checkAuthenticated, userControllers.getCart);

//CART ACTION
router.post("/cart-action", checkAuthenticated, userControllers.cartAction);

//GETTING THE USER
router.get("/orders", checkAuthenticated, userControllers.getOrders);

//ORDER HANDLER
router.post(
  "/order-action/:id",
  checkAuthenticated,
  userControllers.placeOrder
);

module.exports = router;
