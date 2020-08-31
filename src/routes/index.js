const express = require('express')
const routes = express.Router()

const chefs = require('./chefs')
const home = require('./home')
const recipes = require('./recipes')
const users = require('./users')

const { onlyUsers } = require('../app/middlewares/session')

routes.use('/', home)
routes.use('/admin', onlyUsers, chefs)
routes.use('/admin', onlyUsers, recipes)
routes.use('/', users)

module.exports = routes