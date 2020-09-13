const User = require('../models/User')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for(key of keys) {
       if(body[key] == '')  {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }
       }
    }
}

async function post(req, res, next) {
    try {
        const { email } = req.body

        const fillAllFields = checkAllFields(req.body)
        if(fillAllFields) 
            return res.render('admin/user/register', fillAllFields)
    
        const user = await User.findOne({ 
            where: { email }
        })
    
        if(user) {
            return res.render('admin/users/register', {
                user: req.body,
                error: 'Usuário já cadastrado.'
            })
        }
     
        next()
    } catch (error) {
        console.error(error)
    }
}

async function show(req, res, next) {
    try {
        const { id } = req.params

        const user = await User.findOne({ where: { id }} )

        if(!user) {
            req.session.error = 'Usuário não encontrado.'
            return res.redirect('/admin/users')
        }

        req.user = user

        next()
    } catch (error) {
        console.error(error)
    }
}

async function update(req, res, next) {
    try {
        const { email } = req.body

        const user = await User.findOne({ where: {email} })
    
        const fillAllFields = checkAllFields(req.body)
        if(fillAllFields) 
            return res.render('admin/users/show', fillAllFields)
    
        if(user.email == req.body.email && user.id != req.body.id) {
            return res.render('admin/users/show', {
                user: req.body,
                error: 'Email já está sendo utilizado.'
            })
        }

        next()
    } catch (error) {
        console.error(error)
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.body

        const user = await User.findOne({ where: {id} })
     
        if(user.id == req.session.userId)
            return res.render('admin/users/show', {
                user: user,
                error: 'Não é possível deletar a sua própria conta.'
            })
    
        next()
    } catch (error) {
        console.error(error)
    }
}

module.exports = {  
    post,
    show,
    update,
    remove
}