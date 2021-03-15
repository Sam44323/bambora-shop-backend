const { Router } = require('express');

const router = Router();
const userControllers = require('../controllers/users');

// ADDING A NEW USER
router.post('/add-user', userControllers.addUser);

//UPDATE AN USER
router.patch('/update-user/:id', userControllers.updateUser);

// DELETING A USER
router.delete('/delete-user', userControllers.deleteUser);

// LOGIN THE USER
router.post('/login-user', userControllers.loginUser);

//CART ACTION
router.post('/cart-action:id', userControllers.cartAction);

//ORDER HANDLER
router.post('/order-action/:id', userControllers.placeOrder);

module.exports = router;
