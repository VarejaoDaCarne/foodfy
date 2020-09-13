const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const { onlyAdmin } = require('../app/middlewares/session')
const ChefValidator = require('../app/validators/chef')
const ChefController = require('../app/controllers/ChefController')

routes.get('/chefs', ChefController.index)
routes.get('/chefs/create', onlyAdmin, ChefController.create) 
routes.get('/chefs/:id', ChefValidator.show, ChefController.show) 
routes.get('/chefs/:id/edit', onlyAdmin, ChefController.edit) 

routes.post('/chefs', onlyAdmin, multer.array('photos', 1), ChefValidator.post, ChefController.post)
routes.put('/chefs', onlyAdmin, multer.array('photos', 1), ChefValidator.put, ChefController.put)
routes.delete('/chefs', onlyAdmin, ChefValidator.delete, ChefController.delete)

module.exports = routes