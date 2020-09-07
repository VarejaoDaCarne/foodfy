const faker = require('faker')
faker.locale= 'pt_BR'

const { hash } = require('bcryptjs')

const { chefs: dataChefs, recipes: dataRecipes } = require('./data.json')

const Base = require('./src/app/models/Base')
const Chef = require('./src/app/models/Chef')
const File = require('./src/app/models/File')
const Recipe = require('./src/app/models/Recipe')
const RecipeFile = require('./src/app/models/RecipeFile')
const User = require('./src/app/models/User')

const chefsIds = []
const limitChefs = 6
const limitRecipes = 6
const limitUsers = 3
let usersIds = []




async function init() {
    await createUsers()
    await createFiles()
    await createChefs()
    await createRecipes()
}