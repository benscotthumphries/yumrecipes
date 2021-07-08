const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb://localhost:27017/yumrecipes', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

const users = require("./users.js");
app.use("/api/users", users.routes);

const recipes = require("./recipes.js");
app.use("/api/recipes", recipes.routes);


app.listen(3002, () => console.log('Server listening on port 3002!'));