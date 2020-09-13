const Chef = require('../models/Chef')
const RecipeFile = require('../models/RecipeFile')
const LoadRecipeService = require('../services/LoadRecipeService')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for(key of keys) {
       if(body[key] == '' && key != 'removed_files')  {
            return true
       }
    }
}
  
module.exports = {
    async show(req, res, next) {
        try {
            const recipe = await LoadRecipeService.load('recipe', req.params.id )
    
            if(!recipe) {
                req.session.error = 'Receita não encontrada.'
                return res.redirect('/admin/recipes')
            }
    
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res, next) {
        try {
            const fillAllFields = checkAllFields(req.body),
                chefOptions =  await Chef.findAll()
                
            if (fillAllFields) {
                return res.render('admin/recipes/create', {
                    recipe: req.body,
                    chefOptions,
                    error: 'Por favor, preencha todos os campos.',
                })
            }
    
            if(req.files[0] == undefined) {
                return res.render('admin/recipes/create', {
                    recipe: req.body,
                    chefOptions,
                    error: 'Ao menos uma imagem deve ser enviada.'
                })
            }
            
            next()
        }catch (error) {
            console.error(error)
        }
    },
    async put(req, res, next) {
        try {
            const recipe =  await LoadRecipeService.load('recipe', req.body.id),
                fillAllFields = checkAllFields(req.body),
                chefOptions =  await Chef.findAll()

            if (fillAllFields) {
                return res.render('admin/recipes/edit', {
                    recipe,
                    chefOptions,
                    error: 'Por favor, preencha todos os campos.',
                })
            }
            
            if(req.body.removed_files) {
                const recipeFiles = await RecipeFile.find(req.body.id)

                const removedFiles = req.body.removed_files.split(',')
                const lasIndex = removedFiles.length - 1
                removedFiles.splice(lasIndex, 1)

                if (req.files && req.files.length === 0 && removedFiles.length == recipeFiles.length) {
                    return res.render('admin/recipes/edit', {
                        recipe,
                        chefOptions,
                        error: 'Ao menos uma imagem deve ser enviada.'
                    })
                }
            }      
            
            next()
        }catch (error) {
            console.error(error)
        }
    }
}