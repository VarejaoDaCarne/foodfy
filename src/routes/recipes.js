const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const { ownerOfRecipeOrAdmin } = require('../app/middlewares/session')
const RecipeValidator = require('../app/validators/recipe')
const RecipeController = require('../app/controllers/RecipeController')

routes.get('/recipes', RecipeController.index)
routes.get('/recipes/create', RecipeController.create) 
routes.get('/recipes/:id', RecipeValidator.show, RecipeController.show) 
routes.get('/recipes/:id/edit', ownerOfRecipeOrAdmin, RecipeController.edit) 

routes.post('/recipes', multer.array('photos', 5), RecipeValidator.post, RecipeController.post)
routes.put('/recipes', multer.array('photos', 5), ownerOfRecipeOrAdmin, RecipeValidator.put, RecipeController.put)
routes.delete('/recipes', ownerOfRecipeOrAdmin, RecipeController.delete)

module.exports = routes