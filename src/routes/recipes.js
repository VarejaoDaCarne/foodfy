const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const { onlyOneOwnRecipeOrAdmin } = require('../app/middlewares/session')
const RecipeValidator = require('../app/validators/recipe')
const RecipeController = require('../app/controllers/RecipeController')

routes.get('/recipes', RecipeController.index)
routes.get('/recipes/create', RecipeController.create) 
routes.get('/recipes/:id', RecipeController.show) 
routes.get('/recipes/:id/edit', onlyOneOwnRecipeOrAdmin, RecipeController.edit) 

routes.post('/recipes', multer.array('photos', 5), RecipeValidator.post, RecipeController.post)
routes.put('/recipes', multer.array('photos', 5), RecipeValidator.put, RecipeController.put)
routes.delete('/recipes', RecipeController.delete)

module.exports = routes