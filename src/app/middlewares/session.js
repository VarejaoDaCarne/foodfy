const User = require('../models/User')
const Recipe = require('../models/Recipe')

function onlyUsers(req, res, next) {
    if(!req.session.userId)
        return res.redirect('/login')

    next()
}

function isLoggedRedirectToUsers(req, res, next) {
    if(req.session.userId)
        return res.redirect('admin/users')

    next()
}

async function onlyOneOwnRecipeOrAdmin(req, res, next) {
    let { userId: id } = req.session

    const user = await User.findOne({ 
        where: { id }
    })

    let recipe = await Recipe.find(req.params.id)

    if(!user.is_admin && recipe != id)
        return res.render(`admin/profile/index`, {
            user: user,
            error: "Apenas administrador ou a sua própria conta" 
        })

    next()
}

async function onlyUserOrAdmin(req, res, next) {
    let { userId: id } = req.session

    const user = await User.findOne({ 
        where: { id }
    })

    if(!user.is_admin && req.params.id != user.id) 
        return res.render(`admin/profile/index`, {
            user: user,
            error: "Apenas administrador ou a sua própria conta" 
        })

    next()

}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers,
    onlyOneOwnRecipeOrAdmin,
    onlyUserOrAdmin
}