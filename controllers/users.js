const User = require('../models/user')
module.exports.renderRegister = (req, res) => {
    res.render('users/register.ejs')
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp !')
            res.redirect('/campgrounds')
        })
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = async (req, res) => {
    res.render('users/login.ejs')
}

module.exports.login = async (req, res) => {
    const { username } = req.body
    req.flash('success', `Welcome back, ${username}!`)
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out')
    res.redirect('/campgrounds')
}