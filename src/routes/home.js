const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

routes.get('/', HomeController.index) 
routes.get('/about', HomeController.about) 
routes.get('/recipes', HomeController.recipes) 
routes.get('/recipes/:id', HomeController.recipe) 
routes.get('/chefs', HomeController.chefs)
routes.get('/chefs/:id', HomeController.chef)
routes.get('/search', HomeController.search)

module.exports = routes