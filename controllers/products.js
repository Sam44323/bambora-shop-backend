const { validationResult } = require('express-validator');
const Products = require('../models/products');

const getProds = (req, res, next) => {
  Products.find()
    .then((prods) => {
      if (!prods) {
        return res.status(200).json('No product found!');
      }
      res.status(200).json({ products: prods });
    })
    .catch((err) => console.log(err));
};

const getAdminProds = (req, res, next) => {
  Products.find({ creatorId: req.params.id })
    .then((prods) => {
      res.status(200).json({ products: prods });
    })
    .catch((err) => console.log(err));
};

const getProd = (req, res, next) => {
  Products.findById(req.params.id)
    .then((prod) => {
      if (!prod) {
        return res.status(404).json('Product not found!');
      }
      res.status(200).json({ product: prod });
    })
    .catch((err) => console.log(err));
};

const addProd = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ message: errors.errors[0].msg });
  }
  const prod = new Products({
    name: req.body.name,
    image: req.body.image,
    amount: req.body.amount,
    description: req.body.desc,
    creatorId: 'creator 1',
  });
  prod
    .save()
    .then(() => res.status(200).json('Created a new product!'))
    .catch((err) => console.log(err));
};

const updateProd = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ message: errors.errors[0].msg });
  }
  const updatedProd = {
    name: req.body.name,
    amount: req.body.amount,
    image: req.body.image,
  };
  Products.findByIdAndUpdate(req.params.id, { ...updatedProd })
    .then(() => {
      res.status(201).json('Updated the prod!');
    })
    .catch((err) => console.log(err));
};

const deleteProd = (req, res, next) => {
  Products.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).json('Deleted the product!');
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getProds,
  getAdminProds,
  getProd,
  addProd,
  updateProd,
  deleteProd,
};
