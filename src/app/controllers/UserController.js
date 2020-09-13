const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render('admin/users/register')
    },
    async post(req, res) {
        try {
            const password = crypto.randomBytes(5).toString('hex')
            const newPassword = await hash(password, 8)

            if(req.body.is_admin == undefined)
                req.body.is_admin = false
  
            await User.create({
                ...req.body,
                password: newPassword,
            })

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Acessar o sistema',
                html: `<h2>Olá ${req.body.name},</h2>
                <p>Sua conta foi criada com sucesso!
                <br/><br/>
                Sua senha é: ${password}
                <br/><br/>
                Clique no link abaixo para acessar sua conta:</p>
                <p>
                    <a href='http://localhost:3000/login' target='_blank'>
                        ACESSAR A CONTA
                    </a>
                </p>
                `,
            })

            req.session.success = 'Conta criada com sucesso.'
            return res.redirect('/admin/users')
        }catch(error) {
            console.log(error)
            return res.render('admin/users/register', {
                error: 'Algo deu errado.'
            })
        }
    },
    async list(req, res) {
        try {
            const users = await User.findAll()

            const { error, success } = req.session
            req.session.error = ''
            req.session.success = ''

            return res.render('admin/users/index', { users, error, success })
        } catch (error) {
            console.log(error)
            return res.render('admin/users/index', { 
                error: 'Algo deu errado.'
            })
        }
    },
    async show(req, res) {
        try {
            const { user, session: {error, success} } = req
            req.session.error = ''
            req.session.success = ''

            return res.render('admin/users/show', { user, error, success })
        } catch (error) {
            console.log(error)
            return res.render('admin/users/show', { 
                error: 'Algo deu errado.'
            })
        }
    },
    async put(req, res) {
        try {
            let { name, email, is_admin } = req.body

            if(is_admin == null) 
                is_admin = false
            
            await User.update(req.body.id, {
                name,
                email,
                is_admin
            })

            req.session.success = 'Conta atualizada com sucesso.'
            return res.redirect(`/admin/users/${req.body.id}`)
        }catch(error) {
            console.log(error)
            return res.render('admin/users/show', {
                error: 'Algo deu errado.'
            })
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id)

            req.session.success = 'Conta deletada com sucesso'
            return res.redirect('/admin/users')
        }catch(error) {
            console.error(error)
            return res.render('admin/users/show', {
                error: 'Algo deu errado.'
            })
        }
    }
}