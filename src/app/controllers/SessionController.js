const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const User = require('../models/User')

module.exports = {
    loginForm(req, res) {
        return res.render('admin/session/login')
    },
    async login(req, res) {
        try {
            req.session.userId = req.user.id
        
            return res.redirect('admin/users')
        } catch (error) {
            console.log(error)
        }
    },
    logout(req, res) {
        try {
            req.session.destroy()

            return res.redirect('/login')    
        } catch (error) {
            console.log(error)
        }
    },
    forgotForm(req, res) {
        return res.render('admin/session/password-forgot')
    },
    resetForm(req, res) {
        return res.render('admin/session/password-reset', { token: req.query.token})
    },
    async forgot(req, res) {
        try{
            const user = req.user
            
            const token = crypto.randomBytes(20).toString('hex')

            let now = new Date()
            now = now.setHours(now.getHours() + 1)
    
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })
    
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Esqueceu sua senha?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href='http://localhost:3000/password-reset?token=${token}' target='_blank'>
                       RECUPERAR SENHA
                    </a>
                </p>
                `,
            })

            return res.render('admin/session/forgot-password', {
                success: 'Cheque seu email para resetar sua senha'
            })
        }catch(error) {
            console.log(error)
            return res.render('admin/session/forgot-password', {
                error: 'Algo deu errado, tente novamente'
            })
        }
    },
    async reset(req, res) {
        const user  = req.user
        const {  password, token } = req.body

        try{
            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: '',
                reset_token_expires: ''
            })

            return res.render('session/login', {
                user : req.body,
                success: 'Senha atualizada! Logue.'
            })
        }catch(error) {
            console.log(error)
            return res.render('session/password-reset', {
                user: req.body,
                token,
                error: 'Algo deu errado, tente novamente'
            })
        }
    }
}