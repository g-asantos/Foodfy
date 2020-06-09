const express = require('express')
const routes = express.Router()
const UserValidator = require('../app/Validators/user')
const SessionValidator = require('../app/Validators/session')

const { onlyAdmins , isLogged, deleteSelf, isAdmin } = require('../app/middlewares/session')

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')
const ProfileController = require('../app/controllers/ProfileController')

// //criação usuario





// // login/logout

routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.get('/admin/profile', ProfileController.index)
routes.put('/admin/profile', ProfileController.put)
routes.post('/logout', SessionController.logout)

// // reset password

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

// Rotas que o administrador irá acessar para gerenciar usuários

routes.get('/admin/users', isLogged, isAdmin, UserController.list) //Mostrar a lista de usuários cadastrados
routes.get('/admin/recipes', isLogged, UserController.recipes)
routes.get('/admin/register', onlyAdmins,  UserController.registerForm)
routes.get('/admin/:id/edit' , SessionValidator.edit , UserController.editForm)
routes.post('/register', onlyAdmins,  UserValidator.post, UserController.post) //Cadastrar um usuário
routes.put('/admin/users', SessionValidator.edit, UserController.put) // Editar um usuário
routes.delete('/admin/users/:id', onlyAdmins, deleteSelf, UserController.delete) // Deletar um usuário


module.exports = routes