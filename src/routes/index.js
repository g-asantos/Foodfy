const express = require('express')
const routes = express.Router()

const recipes = require('../app/controllers/RecipesController')


const users = require('./users')
const receitas = require('./recipes')
const chefs = require('./chefs')

routes.use('/users', users)
routes.use('/receitas', receitas)
routes.use('/chefs', chefs)


routes.get('/about', function (req, res) {
	return res.render('recipes/about')
})


routes.get('/', recipes.index) // Home










module.exports = routes