const { Router } = require('express');

const router = Router();
const prodControllers = require('../controllers/products');

//GETTING ALL PRODS
router.get('/get-prods', prodControllers.getProds);

//GETTING A PROD
router.get('/get-prod/:id', prodControllers.getProd);

//ADDING A PROD
router.post('/add-prod', prodControllers.addProd);

//UPDATING A PROD
router.patch('/update-prod/:id', prodControllers.updateProd);

//DELETING A PROD
router.delete('/delete-prod/:id', prodControllers.deleteProd);

module.exports = router;
