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

            if(req.body.is_admin == undefined)
                req.body.is_admin = false
  
            const userId = await User.create({
                ...req.body,
                password: password,
            })

            req.session.userId = userId

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
            
            req.session.destroy()

            return res.render('session/login', {
                success: 'Conta criada com sucesso'
            })
        }catch(error) {
            console.log(error)
            return res.render('admin/users/show', {
                user: req.body,
                error: 'Algo deu errado'
            })
        }
    },
    async list(req, res) {
        try {
            let users = await User.findAll()

            const { userId: id } = req.session
    
            return res.render('admin/users/index', { users, userId: id })
        } catch (error) {
            console.log(error)
        }
    },
    async show(req, res) {
        try {
            const { user } = req
    
            return res.render('admin/users/show', { user })
        } catch (error) {
            console.log(error)
        }
    },
    async put(req, res) {
        try {
            const { user } = req
            let { name, email, is_admin } = req.body

            if(is_admin == null) 
                is_admin = false
            
            await User.update(user.id, {
                name,
                email,
                is_admin
            })

            const users = await User.findAll()

            return res.render('admin/users/index', {
                users,
                success: 'Conta atualizada com sucesso'
            })
        }catch(error) {
            console.log(error)
            return res.render('admin/users/show', {
                user: req.body,
                error: 'Algo deu errado'
            })
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id)

            users = await User.findAll()

            return res.render('admin/users/index', {
                users,
                success: 'Conta deletada com sucesso'
            })
        }catch(error) {
            console.error(error)
            return res.render('admin/users/show', {
                user: req.body,
                error: 'Algo deu errado'
            })
        }
    }
}