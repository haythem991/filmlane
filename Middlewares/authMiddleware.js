const jwt = require('jsonwebtoken')
const User = require('../Schemas/user')
const dotenv = require('dotenv')
dotenv.config()

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message)
                res.redirect('/login')
            } else {
                console.log(decodedToken)
                next()
            }
        })
    }
    else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err.message)
                res.locals.user = null
                next()
            } else {
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                // if(favorites) {                
                //     console.log(favorites)
                //     const new_Fav = await User.findOneAndUpdate({ _id: decodedToken.id }, { $push: { favorite: favorites }})
                //     console.log(new_Fav)
                // }
                next()
            }
        })
    }else {
        res.locals.user = null
        next()
    }
}




module.exports = { requireAuth, checkUser }