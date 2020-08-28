const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const { onlyUserOrAdmin } = require('../app/middlewares/session')
const ChefValidator = require('../app/validators/chef')
const ChefController = require('../app/controllers/ChefController')

routes.get('/chefs', ChefController.index)
routes.get('/chefs/create', onlyUserOrAdmin, ChefController.create) 
routes.get('/chefs/:id', ChefController.show) 
routes.get('/chefs/:id/edit', onlyUserOrAdmin, ChefController.edit) 

routes.post('/chefs', multer.array('photos', 1), onlyUserOrAdmin, ChefValidator.post, ChefController.post)
routes.put('/chefs', multer.array('photos', 1), onlyUserOrAdmin, ChefValidator.put, ChefController.put)
routes.delete('/chefs', onlyUserOrAdmin, ChefValidator.delete, ChefController.delete)

module.exports = routes