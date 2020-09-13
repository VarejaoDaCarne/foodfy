const { compare } = require('bcryptjs')
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
  
module.exports = {
    async show(req, res, next) {
        try {
            const { id } = req.params
            const user = await User.findOne({ where: { id }} )

            if(!user) {
                req.session.error = 'Usuário não encontrado.'
                return res.redirect('/admin/users')
            }
        
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res, next) {
        try {
            const { id, password } = req.body
            const fillAllFields = checkAllFields(req.body)

            const user = await User.findOne({ where: {id} })

            if (fillAllFields) {
                return res.render('admin/profile/index', fillAllFields)
            }

            if (!password) {
                return res.render('admin/profile/index', {
                    user: req.body,
                    error: 'Digite sua senha para atualizar'
                })
            }

            const passed = await compare(password, user.password);
      
            if (!passed) {
                return res.render('admin/profile/index', {
                    user: req.body,
                    error: 'Senha incorreta'
                })
            }
            
            next()
        } catch (error) {
            console.error(error)
        }
    }
}