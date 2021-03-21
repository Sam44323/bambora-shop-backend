const { validationResult } = require("express-validator");
const Products = require("../models/products");
const { errorCreator } = require("../errorCreator/errorCreator");

const getProds = (req, res, next) => {
  Products.find()
    .then((prods) => {
      if (!prods) {
        return next(errorCreator("No Products Found!"));
      }
      prods = prods.filter((prod) => prod.creatorId.toString() !== req.userId);
      res.status(200).json({ products: prods });
    })
    .catch((err) => {
      console.log(err);
      next(errorCreator("Can't fetch the products at this moment!"));
    });
};

const getAdminProds = (req, res, next) => {
  Products.find({ creatorId: req.userId })
    .then((prods) => {
      if (!prods) {
        return next(errorCreator("Can't get the products this moment!"));
      }
      res.status(200).json({ products: prods });
    })
    .catch((err) => {
      next(errorCreator("Can't get the products this moment!"));
    });
};

const getProd = (req, res, next) => {
  Products.findById(req.params.id)
    .then((prod) => {
      if (!prod) {
        return next(errorCreator("No Products found"));
      }
      res.status(200).json({ product: prod });
    })
    .catch((err) => console.log(err));
};

const addProd = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errorCreator(errors.errors[0].msg));
  }
  const prod = new Products({
    name: req.body.name,
    image: req.body.image,
    amount: req.body.amount,
    description: req.body.desc,
    creatorId: req.userId,
  });
  prod
    .save()
    .then(() => res.status(200).json("Created a new product!"))
    .catch((err) => {
      next(errorCreator("Can't create a product at this moment!"));
    });
};

const updateProd = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errorCreator(errors.errors[0].msg));
  }
  const updatedProd = {
    name: req.body.name,
    amount: req.body.amount,
    image: req.body.image,
  };
  Products.findByIdAndUpdate(req.params.id, { ...updatedProd })
    .then(() => {
      res.status(201).json("Updated the prod!");
    })
    .catch((err) => {
      next(errorCreator("Can't create a product at this moment!"));
    });
};

const deleteProd = (req, res, next) => {
  Products.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).json("Deleted the product!");
    })
    .catch((err) => {
      next(errorCreator("Can't delete the product at this moment!"));
    });
};

module.exports = {
  getProds,
  getAdminProds,
  getProd,
  addProd,
  updateProd,
  deleteProd,
};
