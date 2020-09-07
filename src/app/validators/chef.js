const LoadChefService = require('../services/LoadChefService')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for(key of keys) {
       if(body[key] == '' && key != 'removed_files')  {
            return {
                chef: body,
                error: 'Por favor, preencha todos os campos'
            }
       }
    }
}
  
module.exports = {
    post(req, res, next) {
        try {
            const fillAllFields = checkAllFields(req.body)

            if (fillAllFields) {
                return res.render('admin/chefs//create', {
                    chef: req.body,
                    error: 'Todos os campos devem ser preenchidos!',
                })
            }
    
            if (req.body.removed_files != '' && req.files[0] == undefined) {
                return res.render('admin/chefs/create', {
                    chef: req.body,
                    error: 'Ao menos uma imagem deve ser enviada'
                })
            }
            
            next()
        } catch (error) {
            console.error(error)
        }
    },
    put(req, res, next) {
        try {
            const fillAllFields = checkAllFields(req.body)

            if (fillAllFields) {
                return res.render('admin/chefs/edit', {
                    chef: req.body,
                    error: 'Todos os campos devem ser preenchidos!',
                })
            }
    
            if (req.body.removed_files != '' && req.files[0] == undefined) {
                return res.render('admin/chefs/edit', {
                    chef: req.body,
                    error: 'Ao menos uma imagem deve ser enviada'
                })
            }
            
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res, next) {
        try {
            const recipes = await LoadChefService.load('chefRecipes', req.params.id)

            if (recipes) {
                return res.render('admin/chefs/edit', {
                    chef: req.body,
                    error: 'Chefe com receita não pode ser deletado',
                })
            }
    
            next()
        } catch (error) {
            console.error(error)
        }
    }
}