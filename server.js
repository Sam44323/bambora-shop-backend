const express = require("express");
const mongoose = require("mongoose");
const { json } = require("body-parser");

const app = express();
const userRoutes = require("./routes/users");
const prodRoutes = require("./routes/products");
const { MONGO_URI } = require("./constants");

app.use(json({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/bambora-shop/users", userRoutes);
app.use("/bambora-shop/products", prodRoutes);

app.use((req, res) => res.status(404).json({ message: "Page not Found!" }));

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to the database!");
    app.listen(5000, () => {
      console.log("Server is running!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
