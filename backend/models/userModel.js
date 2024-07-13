const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Auction = require('./auctionModel'); 
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true
    }, 
    userName:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isArtist: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        require: true,
        default: false
    },
    orderList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction'
    }]
},{timestamps: true})




//static login metoda
userSchema.statics.login = async function(email,password){
    if ( !email || !password) {
        throw Error('Sva polja moraju biti popunjena')
    }

    const user = await this.findOne({ email })
    if(!user){
        throw Error('mail nije tačan')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error('Šifra nije tačna')
    }

    return user
}


// static signup metoda
userSchema.statics.signup = async function(firstName, lastName, email, userName,password, isArtist) {

        //validacija
    if (!firstName ||!lastName|| !userName || !email || !password) {
        throw Error('Sva polja moraju biti popunjena')
    }
    if(!validator.isAlphanumeric(userName)){
        throw Error('Korisnicko name nije validno')
    }
    if (!validator.isEmail(email)){
        throw Error('mail nije validan')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('password nije dovoljno jaka')
    }

    const exists = await this.findOne({ $or: [{ email }, { userName }] })
    if(exists){
        throw Error("Email/Username je vec u postojanju")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ firstName, lastName, email, userName, password: hash, isArtist})

    return user
}

module.exports = mongoose.model('User', userSchema)