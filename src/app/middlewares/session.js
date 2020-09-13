const User = require('../models/User')
const Recipe = require('../models/Recipe')

function onlyUsers(req, res, next) {
    if(!req.session.userId) {
        return res.render('admin/session/login', {
            error: 'Somente usuários podem ver está seção.'
        })
    }

    next()
}

async function onlyAdmin(req, res, next) {
    if(!req.session.admin) {
        req.session.error = 'Somente administradores podem fazer está ação.'
        return res.redirect(`/admin/users`)
    }

    next()
}

function isLoggedRedirectToProfile(req, res, next) {
    if(req.session.userId) {
        req.session.error = 'Você já está logado no sistema.'
        return res.redirect(`/admin/profile/${req.session.userId}`)
    }

    next()
}

async function ownerOfRecipeOrAdmin(req, res, next) {
    let { userId: id } = req.session

    const user = await User.findOne({ 
        where: { id }
    })

    const recipe = await Recipe.find(req.params.id)

    if(!user.is_admin && recipe.user_id != user.id) {
        req.session.error ='Você só pode modificar suas receitas.' 
        return res.redirect(`/admin/recipes`)
    }

    next()
}

module.exports = {
    onlyUsers,
    onlyAdmin,
    isLoggedRedirectToProfile,
    ownerOfRecipeOrAdmin,
}