const Home = require('../models/Home')
const Recipe = require('../models/Recipe')
const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService = require('../services/LoadChefService')

module.exports = {
    async index(req, res) {
        try {
            const recipes = await LoadRecipeService.load('recipes')
    
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
            let results,
            pagination
            params = {}
            let { filter, page, limit } = req.query

            page = page || 1
            limit = limit || 3
            let offset = limit * (page -1)

            params = {
                filter,
                page,
                limit,
                offset,
            }

            results = await Home.paginate(params)

            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)

                return files[0]
            }
    
            const recipesPromise = results.rows.map(async recipe => {
                recipe.src = await getImage(recipe.id)
        
                return recipe
            })
        
            recipes = await Promise.all(recipesPromise)

            if(recipes[0]) {
                pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }
            }
            
            return res.render('home/search', { recipes, pagination, filter })
        } catch (error) {
            console.error(error)
        } 
    }
}