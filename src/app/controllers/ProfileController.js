const User = require('../models/User')

module.exports = {
    async index(req, res) {
        try {
            const { user } = req

            return res.render("admin/profile/index", { user })
        } catch (error) {
            console.error(error)
            return res.render('admin/profile/index', {
                user: user,
                error: 'Algo deu errado'
            })
        }
 
    },
    async put(req, res) {
        try {
            const { user } = req

            await User.update(user.id, {
                ...req.body
            })
 
            return res.render("admin/users/index", {
                success: "Conta atualizada com sucesso"
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/profile/index", {
                user: req.body,
                error: "Algo deu errado"
            })
        }
    }
}