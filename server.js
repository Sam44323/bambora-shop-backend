const express = require('express');
const mongoose = require('mongoose');
const { json } = require('body-parser');

const app = express();
const userRoutes = require('./routes/users');
const prodRoutes = require('./routes/products');

app.use(json({ extended: true }));

app.use('/bambora-shop/users', userRoutes);
app.use('/bambora-shop/products', prodRoutes);

app.use((req, res) => res.status(404).json({ error: 'Page not Found!' }));

mongoose
  .connect(
    'mongodb+srv://admin-suranjan:admin-suranjan@cluster0.hzfia.mongodb.net/bambora-shop?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log('Connected to the database!');
    app.listen(5000, () => {
      console.log('Server is running!');
    });
  })
  .catch((err) => {
    console.log(err);
  });
