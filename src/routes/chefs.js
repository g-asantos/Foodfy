const express = require('express')
const routes = express.Router()
const chefs = require('../app/controllers/chefs')
const multer = require('../app/middlewares/multer')
const { onlyAdmins, isLogged } = require('../app/middlewares/session')




routes.get("/", chefs.chefs); // Mostrar a lista de chefs
routes.get("/create", isLogged, onlyAdmins, chefs.create); // Mostrar formulário de novo chef
routes.get("/:id", chefs.show); // Exibir detalhes de um chef
routes.get("/:id/receitas", chefs.recipes);
routes.get("/:id/edit", isLogged, onlyAdmins, chefs.edit); // Mostrar formulário de edição de chef
routes.post("/", onlyAdmins, multer.array('photos', 1), chefs.post); // Cadastrar novo chef
routes.put("/", onlyAdmins, multer.array('photos', 1), chefs.put); // Editar um chef
routes.delete("/", onlyAdmins, chefs.delete)




module.exports = routes