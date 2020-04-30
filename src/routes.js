const express = require('express')
const nunjucks = require('nunjucks')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')
const multer = require('./app/middlewares/multer')
const server = express()
const routes = express.Router()



routes.get("/", recipes.index); // Mostrar a lista de receitas
routes.get('/sobre', function (req, res) {
    return res.render('user/sobre')
});

routes.get('/chefs', chefs.chefs)
routes.get("/receitas", recipes.receitas); // Exibir detalhes de uma receita
routes.get("/receitas/create", recipes.create);  // Mostrar formulário de nova receita
routes.get("/receitas/:id", recipes.show);
routes.get("/receitas/:id/edit", recipes.edit); // Mostrar formulário de edição de receita
routes.post("/user", multer.array('photos', 5), recipes.post); // Cadastrar nova receita
routes.put("/user", multer.array('photos', 5), recipes.put); // Editar uma receita
routes.delete("/user", recipes.delete)






routes.get("/admin", chefs.index); // Mostrar a lista de chefs
routes.get("/admin/create", chefs.create); // Mostrar formulário de novo chef
routes.get("/admin/:id", chefs.show); // Exibir detalhes de um chef
routes.get("/admin/:id/receitas", chefs.recipes);
routes.get("/admin/:id/edit", chefs.edit); // Mostrar formulário de edição de chef
routes.post("/admin", multer.array('photos', 1), chefs.post); // Cadastrar novo chef
routes.put("/admin", multer.array('photos', 1), chefs.put); // Editar um chef
routes.delete("/admin", chefs.delete)




module.exports = routes