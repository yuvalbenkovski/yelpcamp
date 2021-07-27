const { joiCampgroundSchema, joiReviewSchema } = require('./joiSchemas');
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground.js')
const Review = require('./models/review')
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in to do this action.')
        res.redirect('/login')
    }
    else {
        next()
    }
}
module.exports.validateCampground = (req, res, next) => { //middleware !
    const { error } = joiCampgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 400)
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do this action.')
        res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = joiReviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 400)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do this action.')
        res.redirect(`/campgrounds/${id}`)
    }
    else {
        next()
    }
}