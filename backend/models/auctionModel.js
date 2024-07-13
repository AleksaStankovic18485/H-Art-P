const mongoose = require('mongoose')
const User = require('./userModel'); 
const Schema = mongoose.Schema

const auctionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory:{
        type: String,
        required: true
    }, 
    dimensions:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        value: 0,
        required: true
    },
    artist:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    auc_start: {
        type:Date,
        required: true
    },

    auc_ends: {
        type:Date,
        required: true
    },

    topBidder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    active:{
        type:Boolean,
        default:true
    },
    
    status:{
        type:String,
        default:null
    }
    
},{timestamps: false})

module.exports = mongoose.model('Auction', auctionSchema)