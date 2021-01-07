if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '5ff77e97d674490017155d9c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Kalaloch has no shortage of natural areas to explore. The Pacific shoreline just below provides ample habitat for marine life: tide pools reveal crabs and sea urchins at low tide; sea otters float on the surface of submerged kelp beds; shorebirds nest on beaches; and whales and dolphins occasionally emerge offshore. Beyond the national park's 73 miles of coastline lie three national wildlife refuges and one marine sanctuary.",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: ' https://res.cloudinary.com/deycizjsu/image/upload/v1609278218/YelpCamp/xxxr6uopf76efggp0eot.jpg',
                    filename: 'YelpCamp/xxxr6uopf76efggp0eot'
                },
                {
                    url: 'https://res.cloudinary.com/deycizjsu/image/upload/v1609278396/YelpCamp/e7jovqlt1vswwb76vl2d.jpg',
                    filename: 'YelpCamp/e7jovqlt1vswwb76vl2d'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})