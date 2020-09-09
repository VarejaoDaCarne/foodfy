const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')
const RecipeFile = require('../models/RecipeFile')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {
        try {
            const recipes = await LoadRecipeService.load('recipes')

            return res.render('admin/recipes/index', { recipes })
        } catch (error) {
            console.error(error)
            return res.render(`admin/recipes/index`, {
                error: 'Algo deu errado'
            })
        }
    },
    async create(req, res) {
        try {
            const chefOptions =  await Chef.findAll()

            return res.render('admin/recipes/create', { chefOptions })  
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/create', {
                error: 'Algo deu errado'
            })
        }
    },
    async post(req, res) {
        try {
            let { chef, title, ingredients, preparation, information } = req.body

            const filesPromise = req.files.map(file =>
                File.create({
                    name: file.filename,
                    path: file.path
                })
            )
        
            const filesId = await Promise.all(filesPromise)

            const recipe = await Recipe.create({
                chef_id: chef,
                user_id: req.session.userId,
                title,
                ingredients,
                preparation,
                information,
            })

            const recipeFilesPromise = filesId.map(fileId =>
                RecipeFile.create({
                    recipe_id: recipe,
                    file_id: fileId
                })
            )
               
            await Promise.all(recipeFilesPromise)

            const recipes = await LoadRecipeService.load('recipes')
            return res.render(`admin/recipes/index`, {
                recipes,
                success: 'Receita criada com sucesso'
            })
        } catch(error) {
            console.error(error)
            return res.render(`admin/recipes/create`, {
                error: 'Algo deu errado'
            })
        }
    },
    async show(req, res) {
        try {
            const recipe =  await LoadRecipeService.load('recipe', req.params.id)
            
            return res.render('admin/recipes/show', { recipe })
        } catch (error) {
            console.error(error)
            return res.render(`admin/recipes/show`, {
                error: 'Algo deu errado'
            })
        }
    },
    async edit(req, res) {
        try {
            const recipe =  await LoadRecipeService.load('recipe', req.params.id)
      
            const chefOptions =  await Chef.findAll()

            return res.render('admin/recipes/edit', { recipe, chefOptions })
        } catch (error) {
            console.error(error)
            return res.render(`admin/recipes/edit`, {
                error: 'Algo deu errado'
            })
        }
    },
    async put(req, res) {
        try {
            let { chef, title, ingredients, preparation, information } = req.body

            if(req.files.length != 0) {
                const newFilesPromise = req.files.map(file => 
                    File.create({
                        name: file.filename, 
                        path: file.path
                    }))
                    
                const filesId = await Promise.all(newFilesPromise)

                const recipeFilesPromise = filesId.map(fileId => RecipeFile.create({
                    recipe_id: req.body.id,
                    file_id: fileId
                }))

                await Promise.all(recipeFilesPromise)
            }

            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lasIndex = removedFiles.length - 1
                removedFiles.splice(lasIndex, 1)
    
                const removedFilesPromise = removedFiles.map(async id => await RecipeFile.delete(id))
                    
                await Promise.all(removedFilesPromise)        
            }
            
            await Recipe.update(req.body.id, { 
                chef_id: chef,
                title,
                ingredients,
                preparation,
                information
            })     

            const recipes = await LoadRecipeService.load('recipes')

            return res.render(`admin/recipes/index`, {
                recipes,
                success: 'Receita atualizada com sucesso'
            })
        }catch(error) {
            console.error(error)
            return res.render(`admin/recipes/edit`, {
                error: 'Algo deu errado'
            })
        }
    },
    async delete(req, res) {
        try {
            const files = await RecipeFile.find(req.body.id)

            const filesPromise = files.map(file => {
                RecipeFile.delete(file.id)
            })

            await Promise.all(filesPromise)

            await Recipe.delete(req.body.id) 

            return res.render(`admin/recipes/index`, {
                success: 'Receita deletada com sucesso'
            })
        }catch(error) {
            console.error(error)
            return res.render('admin/recipes/edit', {
                recipe: req.body,
                error: 'Algo deu errado'
            })
        }
    }
}