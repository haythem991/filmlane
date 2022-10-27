const express = require('express')
const ejs = require('ejs')
const isEmpty = require("is-empty");
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const Movie = require('./Schemas/file')
const { requireAuth, checkUser } = require('./Middlewares/authMiddleware')
const authRoutes = require('./routes/authRoutes')
const User = require('./Schemas/user')
const app = express()
app.use(express.json())
app.use(authRoutes)
app.use(cookieParser())
dotenv.config()
const port = process.env.PORT || 8080
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/views'));
mongoose.connect(process.env.MONGO_URI ,{useNewUrlParser:true}, () => console.log('Connect to db'))


app.get('*', checkUser)

app.post('/watch-later', (req, res) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err.message)
                res.redirect('/login')
            } else {
                const favorite = req.body.favorite
                if(favorite) {     
                    const fav = await Movie.findOne({ title: favorite })
                    let exists = await User.findById({ _id: decodedToken.id }, {favorite: { $elemMatch: {title: favorite}}})
                    exists = exists.favorite
                    console.log(exists)
                    if (exists.length > 0) {
                        res.json('Already Exists')
                    }
                    else {
                        const new_Fav = await User.findOneAndUpdate({ _id: decodedToken.id }, { $push: { favorite: fav }})
                        res.locals.new_Fav = new_Fav
                        res.json(new_Fav)
                    }
                }
            }
        })
    }
})
app.get('/watchlist', (req, res) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err.message)
                res.redirect('/login')
            } else {
                let myfav = await User.findById(decodedToken.id)
                myfav = myfav.favorite
                res.render('favorites', {myfav})
            }
        })
    }
    else {
        res.redirect('/login')
    }
})


app.get('/', (req, res)=> {
    res.redirect('/home')
})

app.get('/contact-us', (req, res) => {
    res.render('contact')
})

app.get('/search', async function (req, res) {
    const {s} = req.query
    if (s.lenght < 1) res.redirect('/home')
    const agg = [
        {
        '$search': {
            'text': {
              'query': s, 
              'path': 'title'
            }
            }
        }, {
        '$project': {
            '_id': 0,
            'title': 1, 
            'image': 1, 
            'rating': 1, 
            'category': 1, 
            'duration': 1,
            'quality': 1
            }
        },
    ]
    const response = await Movie.aggregate(agg)
	isEmpty(response) ? res.redirect("/home") : res.render("search", {response, s});
})

app.get('/home', async (req, res) => {
    movie_ = await Movie.find();
    Movie.find().then((result) => {
        res.render('index', {result})
    }).catch((err) => console.log(err))
})


app.post('/add-movie', async(req, res) => {
    const data = new Movie({
        title: req.body.title,
        image: req.body.image,
        rating: req.body.rating,
        category: {1:req.body.category[1], 2:req.body.category[2]},
        story: req.body.story,
        duration: req.body.duration,
        year: req.body.year,
        country: req.body.country,
        quality: req.body.quality,
        language: req.body.language,
        actor: req.body.actor,
        streaming1: {
            server: req.body.streaming1.server,
            server_name: req.body.streaming1.server_name
        },
        streaming2: {
            server: req.body.streaming2.server,
            server_name: req.body.streaming2.server_name
        },
        streaming3: {
            server: req.body.streaming3.server,
            server_name: req.body.streaming3.server_name
        },
        streaming4: {
            server: req.body.streaming4.server,
            server_name: req.body.streaming4.server_name
        },
        streaming5: {
            server: req.body.streaming5.server,
            server_name: req.body.streaming5.server_name
        },
        downloading1: {
            server: req.body.downloading1.server,
            server_name: req.body.downloading1.server_name
        },
        downloading2: {
            server: req.body.downloading2.server,
            server_name: req.body.downloading2.server_name
        },
        downloading3: {
            server: req.body.downloading3.server,
            server_name: req.body.downloading3.server_name
        },
        downloading4: {
            server: req.body.downloading4.server,
            server_name: req.body.downloading4.server_name
        },
        downloading5: {
            server: req.body.downloading5.server,
            server_name: req.body.downloading5.server_name
        },
    })
    const val = await data.save()
    res.json(val)
})


app.get('/all-movies', (req, res) => {
    Movie.find().then((result) => {
        res.send(result)
    }).catch((err) => console.log(err))
})

app.get("/movies/:titlepost", async (req, res) => {
	const requestedTitle = req.params.titlepost;
	movie_ = await Movie.find({ title: requestedTitle });
	res.render("movie-details", { movie: movie_ });
});

app.get("/category/:category", async (req, res)=> {
    const requestedCat = req.params.category;
	let movies = await Movie.find({ category: requestedCat });
	isEmpty(movies) ? res.redirect("/movies") : res.render("genders", { movies: movies });
})

app.get('/movies/:titlepost/watch', requireAuth, async (req, res) => {
    const requestedTitle = req.params.titlepost;
	movie_ = await Movie.find({ title: requestedTitle });
	res.render("watch", { movie: movie_ });
})

app.get('/movies', async (req, res)=> {
    Movie.paginate({}, {page: req.query.page, limit: 20})
    .then((response) => {
        const page = req.query.page ? Number(req.query.page) : 1;
        let iterator = (page - 5) < 1 ? 1: page - 5
        const totalPages = response['totalPages']
        let endingLink = (iterator + 5) <= totalPages ? (iterator + 5) : page + (totalPages - page);
        if (page > totalPages) {
            res.redirect('?page=1')
        }
        else (res.render('allmovies', {movie: response['docs'], totalPages, page, iterator, endingLink}))
    })
    .catch((err)=> {
        res.json('A Problem has occured'+err)
    })
})


app.listen(port, () => {
    console.log('Listening on 8080')
})