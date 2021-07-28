const mongoose = require('mongoose');
const Campground = require('../models/campground.js')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const axios = require('axios')
const unsplashKey = process.env.UNSPLASH_KEY
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to mongoose !')
    })
    .catch(e => {
        console.log('Connection to mongoose failed')
        console.log(e)
    })

const sample = (arr => {
    return arr[Math.floor(Math.random() * arr.length)]
})

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const rand1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10;
        const collectionData = await axios.get(`https://api.unsplash.com//collections/2029045/photos?client_id=${unsplashKey}&per_page=30`)
        const imageUrls = collectionData.data.map(c => c.urls.full)
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            images: [
                {
                    url: imageUrls[Math.floor(Math.random() * 30)],
                    /* filename: 'YelpCamp/stkdchq9qcgvwssbhgmf' */
                },
                {
                    url: imageUrls[Math.floor(Math.random() * 30)],
                    /* filename: 'YelpCamp/dzg25hmp3p4gwnprdjka' */
                },
                {
                    url: imageUrls[Math.floor(Math.random() * 30)],
                    /* filename: 'YelpCamp/ewk1poc5qfyavecqmfil' */
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude
                ]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem accusantium at laborum, alias, cupiditate aspernatur incidunt, placeat eligendi facere ut mollitia velit? Delectus tempore error harum consectetur odio sint aperiam?',
            price: price,
            author: '60f6ef1d8b18472f80d67a02'
        })
        await camp.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})