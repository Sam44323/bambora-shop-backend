const { Router } = require("express");
const { body } = require("express-validator");

const router = Router();
const prodControllers = require("../controllers/products");
const { checkAuthenticated } = require("../middleware/authMiddleware");

//GETTING ALL PRODS
router.get("/get-prods", checkAuthenticated, prodControllers.getProds);

//GETTING ALL THE PRODUCTS FROM THE LOGGED USER
//will later refactor by using the local storage
router.get(
  "/get-adminProds",
  checkAuthenticated,
  prodControllers.getAdminProds
);

//GETTING A PROD
router.get("/get-prod/:id", checkAuthenticated, prodControllers.getProd);

//ADDING A PROD
router.post(
  "/add-prod",
  checkAuthenticated,
  [
    body("name").notEmpty().withMessage("Please enter product name!"),
    body("image").notEmpty().withMessage("Please enter an image!"),
    body("amount")
      .isFloat({ min: 1 })
      .withMessage("Please enter a valid amount!"),
    body("desc")
      .isLength({ min: 30 })
      .withMessage("Please describe the product properly!"),
  ],
  prodControllers.addProd
);

//UPDATING A PROD
router.patch(
  "/update-prod/:id",
  checkAuthenticated,
  [
    body("name").notEmpty().withMessage("Please enter product name!"),
    body("image").notEmpty().withMessage("Please enter an image!"),
    body("amount")
      .isFloat({ min: 1 })
      .withMessage("Please enter a valid amount!"),
    body("desc")
      .isLength({ min: 30 })
      .withMessage("Please describe the product properly!"),
  ],
  prodControllers.updateProd
);

//DELETING A PROD
router.delete(
  "/delete-prod/:id",
  checkAuthenticated,
  prodControllers.deleteProd
);

module.exports = router;
