const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const recipes = require('../app/controllers/RecipesController')
const { onlyAdmins, isLogged, isCreator } = require('../app/middlewares/session')

routes.get("/", recipes.receitas); 
routes.get("/create", isLogged,  recipes.create);  // Mostrar formulário de nova receita
routes.get("/:id", recipes.show);// Exibir detalhes de uma receita
routes.get("/:id/edit", isLogged, recipes.edit); // Mostrar formulário de edição de receita
routes.post("/",  isLogged, multer.array('photos', 5), recipes.post); // Cadastrar nova receita
routes.put("/", isCreator,  multer.array('photos', 5), recipes.put); // Editar uma receita
routes.delete("/", isCreator, recipes.delete)


module.exports = routes