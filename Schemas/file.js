const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const mongoosePaginate = require('mongoose-paginate-v2')

const MovieSchema = new mongoose.Schema({
    title: String,
    image: String,
    rating: String,
    category: {
        1: String,
        2: String,
    },
    story: String,
    duration: String,
    year:String,
    country: String,
    quality: String,
    language: String,
    actor: String,
    trailer:String,
    streaming1: {
        server: String,
        server_name: String,
    },
    streaming2: {
        server: String,
        server_name: String,
    },
    streaming3: {
        server: String,
        server_name: String,
    },
    streaming4: {
        server: String,
        server_name: String,
    },
    streaming5: {
        server: String,
        server_name: String,
    },
    downloading1: {
        server: String,
        server_name: String,
    },
    downloading2: {
        server: String,
        server_name: String,
    },
    downloading3: {
        server: String,
        server_name: String,
    },
    downloading4: {
        server: String,
        server_name: String,
    },
    downloading5: {
        server: String,
        server_name: String,
    },
});


MovieSchema.plugin(mongoosePaginate)
const Movie = mongoose.model('movie', MovieSchema)
module.exports = Movie
