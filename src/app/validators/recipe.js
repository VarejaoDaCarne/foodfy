const Chef = require('../models/Chef')
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
    async post(req, res, next) {
        try {
            const fillAllFields = checkAllFields(req.body),
                chefOptions =  await Chef.findAll()

            if (fillAllFields) {
                return res.render('admin/recipes/create', {
                    recipe: req.body,
                    chefOptions,
                    error: 'Todos os campos devem ser preenchidos!',
                })
            }
    
            if(req.files[0] == undefined) {
                return res.render('admin/recipes/create', {
                    recipe: req.body,
                    chefOptions,
                    error: 'Ao menos uma imagem deve ser enviada'
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
                    error: 'Todos os campos devem ser preenchidos!',
                })
            }
    
            if (req.body.removed_files == undefined && req.files[0] == undefined) {
                return res.render('admin/recipes/edit', {
                    recipe,
                    chefOptions,
                    error: 'Ao menos uma imagem deve ser enviada'
                })
            }
            
            next()
        }catch (error) {
            console.error(error)
        }
    }
}