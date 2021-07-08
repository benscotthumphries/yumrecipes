const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  path: String,
  title: String,
  ingredients: [String],
  direction: String,
  link: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

router.post("/", validUser, async (req, res) => {
  const recipe = new Recipe({
    user: req.user,
    path: req.body.path,
    title: req.body.title,
    ingredients: req.body.ingredients,
    direction: req.body.direction,
    link: req.body.link,
  });
  try {
    await recipe.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get("/", validUser, async (req, res) => {
  try {
    let recipes = await Recipe.find({
      user: req.user
    }).sort({
      created: -1
    }).populate('user');
    return res.send(recipes);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  try {
    let recipe = await Recipe.findOne({
      _id: req.params.id
    });
    recipe.title = req.body.title;
    recipe.ingredients = req.body.title;
    recipe.direction = req.body.direction;
    await recipe.save();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Recipe.deleteOne({
      _id: req.params.id
    }).populate('user');
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = {
  model: Recipe,
  routes: router,
}