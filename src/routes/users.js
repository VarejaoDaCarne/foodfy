const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/ProfileController')
const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const SessionValidator = require('../app/validators/session')
const ProfileValidator = require('../app/validators/profile')
const UserValidator = require('../app/validators/users')

const { isLoggedRedirectToProfile, onlyAdmin } = require('../app/middlewares/session')

routes.get('/login', isLoggedRedirectToProfile, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

routes.get('/password-forgot', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/password-forgot', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

routes.get('/admin/profile/:id', ProfileValidator.show, UserValidator.show, ProfileController.index) 
routes.put('/admin/profile', ProfileValidator.put, ProfileController.put)

routes.get('/admin/users/register', onlyAdmin, UserController.registerForm)
routes.get('/admin/users', UserController.list)
routes.get('/admin/users/:id', onlyAdmin, UserValidator.show, UserController.show)

routes.post('/admin/users', onlyAdmin, UserValidator.post, UserController.post)
routes.put('/admin/users', onlyAdmin, UserValidator.update, UserController.put) 
routes.delete('/admin/users', onlyAdmin, UserValidator.remove,UserController.delete)

module.exports = routes