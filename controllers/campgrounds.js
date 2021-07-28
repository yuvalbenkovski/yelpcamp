const Campground = require('../models/campground.js')
const { cloudinary } = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const axios = require('axios')

//Unsplash Base URL : https://api.unsplash.com/
module.exports.index = async (req, res) => {
    let campgrounds = await Campground.find({}).limit(20)
    const { search } = req.query
    if (search) {
        campgrounds = await Campground.fuzzySearch(search)
    }
    res.render('campgrounds/index.ejs', { campgrounds, title: 'All Campgrounds'})

}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs')
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.geometry = geoData.body.features[0].geometry
    await campground.save()
    req.flash('success', 'Successfully created a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit.ejs', { campground })
}
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('author')
    if (!campground) {
        req.flash('error', 'Cannot find campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs', { campground })
}
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    await Campground.updateOne(campground, req.body.campground, { runValidators: true, new: true })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Succesfully updated campground!')
    res.redirect(`/campgrounds/${id}`)
}
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}