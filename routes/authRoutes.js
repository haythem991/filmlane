const { Router } = require('express')
const authController = require('../Controllers/authControllers')
const router = Router()

router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)

module.exports = router

// const router = require('express').Router();
// const User = require('./user')
// const bcrypt = require('bcryptjs')

// const jwt = require('jsonwebtoken')
// const Joi = require('joi')


// app.get('/login', (req, res)=> {
//     res.render('singin')    
// })

// app.get('/signup', (req, res)=> {
//     res.render('signup')    
// })

// app.post('/signup', async(req, res)=> {
//     console.log(req.body)
//     const userExists = await User.findOne({email: req.body.email})
//     console.log(req.body.email)
//     if (userExists) return res.status(400).send('email Already exists') 
//     const salt = await bcrypt.genSalt(10)
//     const hashPassword = await bcrypt.hash(req.body.password, salt)
//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password: hashPassword,
//     })
//     try {
//         const savedUser = await user.save()
//         req.flash("success", "Successfully Signed up! nice to meet you"+ req.body.email)
//         res.redirect('/home')
//     }catch(error){
//         res.status('400').send(error)
//     }
// })


// app.post('/login', async(req,res)=> {

//     const token = jwt.sign({_id: user.name}, process.env.TOKEN_SECRET)
//     res.header('auth-token', token).send(token)
// })
// module.exports = router