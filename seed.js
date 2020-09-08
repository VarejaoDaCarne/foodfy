const faker = require('faker')
const { hash } = require('bcryptjs')

const Chef = require('./src/app/models/Chef')
const File = require('./src/app/models/File')
const Recipe = require('./src/app/models/Recipe')
const RecipeFile = require('./src/app/models/RecipeFile')
const User = require('./src/app/models/User')

const { chefs: dataChefs, recipes: dataRecipes } = require('./data.json')

let usersIds = [], chefsIds = [], recipesIds = [], recipeFilesIds = []
const totalRecipeFiles = 30
const totalChefs = 6
const totalRecipes = 6
const totalUsers = 3

async function createUsers() {
    try {   
        const users = []
        const password = await hash('123', 8)
    
        while(users.length < totalUsers) {
            users.push({
                name: faker.name.findName(),
                email: faker.internet.email(),
                password,
                is_admin: true
            })
        }
    
        const usersPromise = users.map(user => User.create(user))
        usersIds = await Promise.all(usersPromise)
    } catch (error) {
        console.log(error)
    }
}

async function createChefs() {
    try {
        let chefs = [], files = [], filesIds = [], i = 0

        while(files.length < totalChefs) {
             files.push({
                 name: faker.image.image(),
                 path:`https://source.unsplash.com/collection/8470962/${Math.round(Math.random() * 100)}`
             })
        }
     
        const filesPromise = files.map(file => File.create(file))
        filesIds = await Promise.all(filesPromise)
     
         while(chefs.length < totalChefs) {
             chefs.push({
                 name: faker.name.findName(),
                 file_id: filesIds[i]
             })
             i++
         }
     
         const chefsPromise = chefs.map(chef => Chef.create(chef))
         chefsIds = await Promise.all(chefsPromise)
    } catch (error) {
        console.log(error)
    }
}

async function createRecipes() {
    try {
        let recipes = [], files = []

        while (recipes.length < totalRecipes) {
            recipes.push({
                chef_id: chefsIds[Math.floor(Math.random() * chefsIds.length)],
                title: faker.name.title(),
                user_id: usersIds[Math.floor(Math.random() * usersIds.length)], 
                ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 5)).split('. '), 
                preparation: faker.lorem.paragraph(Math.ceil(Math.random() * 5)).split('. '), 
                information: faker.lorem.paragraph(Math.ceil(Math.random() * 5))
            })
        }
    
        const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
        recipesIds = await Promise.all(recipesPromise)
    
        while(files.length < totalRecipeFiles) {
            files.push({
                name: faker.image.image(),
                path: `https://source.unsplash.com/collection/345760/${Math.round(Math.random() * 100)}`
            })
        }
    
        const filesPromise = files.map(file => File.create(file))
        recipeFilesIds = await Promise.all(filesPromise)
    } catch (error) {
        console.log(error)
    }  
}

async function createRecipeFiles() {
    try {
        let recipeFiles = []

        while(recipeFiles.length < 20) {
            recipeFiles.push({
                recipe_id: recipesIds[Math.round(Math.random() * recipesIds.length)],
                file_id: recipeFilesIds[Math.round(Math.random() * recipeFilesIds.length)]
            })

            for (let i = 0; i < totalRecipes; i++) {
                let tot = 0
                const lim = 5
                
                recipeFiles.forEach(file => {
                    if (file.file_id == i) tot++
                    if (tot > lim) recipeFiles.splice(recipeFiles.indexOf(file),1)
                })
            }
        }
    
        const recipeFilesPromise = recipeFiles.map(file => RecipeFile.create(file))
        await Promise.all(recipeFilesPromise)
    } catch (error) {
        console.log(error)
    }
}

async function init() {
    await createUsers(),
    await createChefs(),
    await createRecipes(),
    await createRecipeFiles()
}

init()