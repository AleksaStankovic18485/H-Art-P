const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
  
    res.status(statusCode);
  
    res.json({
      message: err.message,
      stack: err.stack,
    });
  };

const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const authenticate = asyncHandler(async(req,res,next)=>{
  
    let token;

    token = req.cookies.jwt

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.SECRET)
            req.user=await User.findById(decoded.userId).select('-password')
            next();
        } catch (error) {
            res.status(401)
            throw new Error("Autentifikacija neuspesna.")
        }
    }
    else {
        res.status(401)
        throw new Error("Autentifikacija neuspesna, nema tokena.")
    } 
});

const authorizeAdmin = (req,res,next) => {
    if(req.user && req.user.isAdmin) {
        next()
    }
    else {
        res.status(401).send("Admin nije autorizovan")
    }
};
  
  module.exports = {
    errorHandler,
    authorizeAdmin,
    authenticate
  };