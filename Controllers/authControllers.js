const User = require('../Schemas/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const handleErrors = (error) => {
    console.log(error.message, error.code)
    let errors = { name: "", email : "", password: "" }
    let errora = { message : "" }

    if (error.message === "Email or password is incorrect") {
        errora.message = "Email or password is incorrect."
        return errora
    }

    if (error.message.includes('test.users index: email_1 dup key')) {
        errors.email = "This email is already registered"
        return errors
    }
    if (error.message.includes('Minimum password length is 6 characters')) {
        errors.password = "Please try another password !"
        return errors
    }
}

const maxAge = 3*24*60*60
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
}


module.exports.signup_get = (req, res) => {
    res.render('signup')
}
module.exports.signup_post = async(req, res) => {
    const { name, email, password } = req.body   
    try {
        const user = await User.create({ name, email, password})
        const token = createToken(user._id)
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        })
        res.status(201).json({user: user._id})
    } catch(error) {
        const errors = handleErrors(error)
        res.status(400).json({ errors })
    }
}
module.exports.login_get = (req, res) => {
    res.render('signin')
}
module.exports.login_post = async (req, res) => {
    const {email , password} = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        })
        res.status(200).json({user: user._id})
    } catch(error) {
        const errora = handleErrors(error) 
        res.status(400).json({ errora })
    }
}
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/home')
}
