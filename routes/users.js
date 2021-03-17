const { Router } = require('express');
const { body } = require('express-validator');

const router = Router();
const userControllers = require('../controllers/users');

// ADDING A NEW USER
router.post(
  '/add-user',
  [
    body('name').notEmpty().withMessage('Please enter your name!'),
    body('email').isEmail().withMessage('Please enter a valid email!'),
    body('password')
      .isStrongPassword({ minLength: 5 })
      .withMessage('Please enter a password of at-least 5 character!'),
  ],
  userControllers.addUser
);

//UPDATE AN USER
router.patch(
  '/update-user/:id',
  [
    body('name').notEmpty().withMessage('Please enter your name!'),
    body('email').isEmail().withMessage('Please enter a valid email!'),
    body('password')
      .isStrongPassword({ minLength: 5 })
      .withMessage('Please enter a password of at-least 5 character!'),
  ],
  userControllers.updateUser
);

// DELETING A USER
router.delete('/delete-user', userControllers.deleteUser);

// LOGIN THE USER
router.post('/login-user', userControllers.loginUser);

//CART ACTION
router.post('/cart-action:id', userControllers.cartAction);

//ORDER HANDLER
router.post('/order-action/:id', userControllers.placeOrder);

module.exports = router;
