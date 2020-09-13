const User = require('../models/User')

module.exports = {
    async index(req, res) {
        try {
            const { user, session: {error, success} } = req
            req.session.error = ''
            req.session.success = ''

            return res.render('admin/profile/index', { user, error, success })
        } catch (error) {
            console.error(error)
            return res.render('admin/profile/index', {
                error: 'Algo deu errado'
            })
        }
    },
    async put(req, res) {
        try {
            await User.update(req.body.id, {
                name: req.body.name,
                email: req.body.email
            })

            req.session.success = 'Conta atualizada com sucesso'
            return res.redirect(`/admin/users`)
        }catch(error) {
            console.error(error)
            return res.render('admin/profile/index', {
                error: 'Algo deu errado'
            })
        }
    }
}