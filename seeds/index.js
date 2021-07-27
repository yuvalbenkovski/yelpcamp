const mongoose = require('mongoose');
const Campground = require('../models/campground.js')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
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
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dsutpkolh/image/upload/v1624909407/YelpCamp/stkdchq9qcgvwssbhgmf.jpg',
                    filename: 'YelpCamp/stkdchq9qcgvwssbhgmf'
                },
                {
                    url: 'https://res.cloudinary.com/dsutpkolh/image/upload/v1624909422/YelpCamp/dzg25hmp3p4gwnprdjka.jpg',
                    filename: 'YelpCamp/dzg25hmp3p4gwnprdjka'
                },
                {
                    url: 'https://res.cloudinary.com/dsutpkolh/image/upload/v1624909434/YelpCamp/ewk1poc5qfyavecqmfil.jpg',
                    filename: 'YelpCamp/ewk1poc5qfyavecqmfil'
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