const { compare } = require('bcryptjs')
const User = require('../models/User')

async function login(req, res, next) {
    try{
        const { email, password } = req.body

        const user = await User.findOne({ where: {email} })
    
        if(!user) return res.render('admin/session/login', {
            user: req.body,
            error: 'Usuário não registrado.'
        })

        const passed = await compare(password, user.password)

        if(!passed) return res.render('admin/session/login', {
            user: req.body,
            error: 'Senha incorreta.'
        })
    
        req.user = user
        
        next()
    }catch(error) {
        console.error(error)
    }
}

async function forgot(req, res, next) {
    try {
        const { email } = req.body

        let user = await User.findOne({ where: { email }})
    
        if(!user) 
            return res.render('admin/session/password-forgot', {
                user: req.body,
                error: 'Email não registrado.'
            })

        req.user = user
        
        next()
    }catch(error) {
        console.error(error)
    }
}

async function reset(req, res, next) {
    try {
        const { email, password, token, passwordRepeat } = req.body

        const user = await User.findOne({ where: { email }} )
    
        if(!user) 
            return res.render('admin/session/password-reset', {
                user: req.body,
                token,
                error: 'Usuário não registrado.'
            })
    
        if(password != passwordRepeat) 
            return res.render('admin/session/password-reset', {
                user: req.body,
                token,
                error: 'Senhas não correspondem.'
            })
    
        if(token != user.reset_token) 
            return res.render('admin/session/password-reset', {
                user: req.body,
                token,
                error: 'Token inválido! Tente novamente.'
            })
    
        let now = new Date()
        now = now.setHours(now.getHours())
    
        if(now > user.reset_token_expires) 
            return res.render('admin/session/password-reset', {
                user: req.body,
                token,
                error: 'Token expirou! Solicite o formulário de resetar a senha novamente.'
            })
    
        req.user = user
    
        next()
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    login,
    forgot,
    reset
}