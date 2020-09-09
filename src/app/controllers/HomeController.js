const Recipe = require('../models/Recipe')
const RecipeFile = require('../models/RecipeFile')
const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService = require('../services/LoadChefService')

module.exports = {
    async index(req, res) {
        try {
            const allRecipes = await LoadRecipeService.load('recipes')
            const recipes = allRecipes.filter((recipe, index) => index > 5 ? false : true)

            return res.render('home/index', { recipes })
        } catch (error) {
            console.error(error)
            return res.render('home/index', {
                error: 'Algo deu errado'
            })
        }
    },
    about(req, res) {
        return res.render('home/about')
    },
    async recipes(req, res) {
        try {
            const recipes = await LoadRecipeService.load('recipes')  

            return res.render('home/recipes', { recipes })
        } catch (error) {
            console.error(error)
            return res.render('home/recipes', {
                error: 'Algo deu errado'
            })
        }
    
    },
    async recipe(req, res) {
        try {
            const recipe =  await LoadRecipeService.load('recipe', req.params.id)
    
            return res.render('home/recipe', { recipe })
        } catch (error) {
            console.error(error)
            return res.render('home/recipe', {
                error: 'Algo deu errado'
            })
        }
    },
    async chefs(req, res) {
        try {
            const chefs = await LoadChefService.load('chefs')

            return res.render('home/chefs', { chefs })
        } catch (error) {
            console.error(error)
            return res.render('home/chefs', {
                error: 'Algo deu errado'
            })
        }     
    },
    async chef(req, res) {
        try {
            const chef = await LoadChefService.load('chef', req.params.id )

            const recipes = await LoadChefService.load('chefRecipes', req.params.id)

            return res.render('home/chef', { chef , recipes })       
        } catch (error) {
            console.error(error)
            return res.render('home/chef', {
                error: 'Algo deu errado'
            })
        }
    },
    async search(req, res) {
        try {
            let recipes,
            params = {},
            { filter } = req.query

            params = { filter }

            recipes = await Recipe.search(params)

            if (recipes[0] == undefined) {
                return res.render('home/recipes', {
                    filter,
                })
            }

            const recipesPromise = recipes.map(async recipe => {
                const files = await RecipeFile.find(recipe.id)
                if (files[0]) recipe.img = files[0].path.replace('public', '')
              })
        
            await Promise.all(recipesPromise)
            
            return res.render('home/recipes', { recipes, filter })
        } catch (error) {
            console.error(error)
        } 
    }
}