const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    name: { type:String, required:[true, 'Please enter a name'], unique:false },
    email: { type:String, required:[true, 'Please enter an email'], unique:true, lowercase: true},
    password: { type:String, required:[true, 'Please enter a password'], minlength: [6, 'Minimum password length is 6 characters']},
    favorite: {type: Array, required:false, default: null},
    date: {type: Date, default: Date.now}
}, {collection: 'users'})

UserSchema.post('save', function (doc, next) {
    next();
})

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)    
    next()
})

UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if(user) {
        const validPass = await bcrypt.compare(password, user.password)
        if (validPass) {
            return user
        }
        throw Error('Email or password is incorrect')
    }
    throw Error('Email or password is incorrect')
}

const User = mongoose.model('users', UserSchema)
module.exports = User