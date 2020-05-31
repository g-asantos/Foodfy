const express = require('express')
const routes = express.Router()

const recipes = require('../app/controllers/RecipesController')


const users = require('./users')
const receitas = require('./recipes')
const chefs = require('./chefs')

routes.use('/users', users)
routes.use('/receitas', receitas)
routes.use('/chefs', chefs)


routes.get('/sobre', function (req, res) {
    return res.render('recipes/sobre')
});


routes.get("/", recipes.index); // Home










module.exports = routes