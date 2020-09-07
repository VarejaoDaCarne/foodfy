const Chef = require('../models/Chef')
const File = require('../models/File')
const LoadChefService = require('../services/LoadChefService')

module.exports = {
    async index(req, res) {
        try {
            const chefs = await LoadChefService.load('chefs')

            return res.render('admin/chefs/index', { chefs })
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/index', {
                error: 'Algo deu errado'
            })
        }
    },
    create(req, res) {
        try {
            return res.render('admin/chefs/create')
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) { 
        try {
            const filePromise = req.files.map(file =>
                File.create({
                    name:  file.filename,
                    path: file.path
                })
            )
            
            const fileId = await Promise.all(filePromise)

            const chefPromise = fileId.map((fileId) =>
                Chef.create({
                    ...req.body,
                    file_id: fileId
                })
            )
    
            await Promise.all(chefPromise)

            const chefs = await LoadChefService.load('chefs')
            return res.render('admin/chefs/index', { 
                chefs,
                success: 'Chefe criado com sucesso'
            })
        } catch(error) {
            console.error(error)
            return res.render('admin/chefs/create', {
                error: 'Algo deu errado'
            })
        }
    },
    async show(req, res) {
        try {
            const chef = await LoadChefService.load('chef', req.params.id )

            const recipes = await LoadChefService.load('chefRecipes', req.params.id)

            return res.render('admin/chefs/show', { chef , recipes })       
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/show', {
                error: 'Algo deu errado'
            })
        }
    },
    async edit(req, res) {
        try {
            const chef = await LoadChefService.load('chef', req.params.id )

            return res.render('admin/chefs/edit', { chef })
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/edit', {
                error: 'Algo deu errado'
            })
        }
    },
    async put(req, res) {
        try { 
            if(req.files.length != 0) {
                const newFilesPromise = req.files.map(file => 
                    File.create({
                        name: file.filename, 
                        path: file.path
                    }))
                    
                const fileId = await Promise.all(newFilesPromise)

                await Chef.update(req.body.id, { 
                    name: req.body.name, 
                    file_id: `${fileId}`
                })     
            }

            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lasIndex = removedFiles.length - 1
                removedFiles.splice(lasIndex, 1)
    
                const removedFilesPromise = removedFiles.map(async id => await File.chefDelete(id))
                    
                await Promise.all(removedFilesPromise)        
            }
            
            await Chef.update(req.body.id, { name: req.body.name } )

            const chefs = await LoadChefService.load('chefs')
            return res.render('admin/chefs/index', { 
                chefs, 
                success: 'Chefe atualizado com sucesso'
            }) 
        }catch(error) {
            console.error(error)
            return res.render('admin/chefs/edit', {
                error: 'Algo deu errado'
            })
        }
    },
    async delete(req, res) {
        try {
            await Chef.delete(req.body.id)
      
            return res.render('admin/chefs/index', {
                success: 'Chefe deletado com sucesso',
            })
        }catch(error) {
            console.error(error)
            return res.render('admin/chefs/edit', {
                error: 'Algo deu errado'
            })
        }
    }
}