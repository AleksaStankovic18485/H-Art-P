// const asyncHandler = require('../middlewares/asyncHandler.js')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')



const createToken = (res, userId) => {
   const token = jwt.sign({userId}, process.env.SECRET, {
    expiresIn: "30d",
   });

   res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV = "development",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000,
   });

   return token;
};

//get korisnik
const getUsers = async (req,res)=>{
    const korisnici = await User.find({}).sort({createdAt: -1})

    res.status(200).json(korisnici)
}

//get {ID} korisnik
const getUser = async (req,res)=>{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'Nema korisnik sa tim ID-em'})
    }

    const korisnik = await User.findById(id)

    if(!korisnik) {
        return res.status(404).json({error:'Korisnik sa tim ID-em nije u postojanju'})
    }

    res.status(200).json(korisnik)
}


const getUserByUserName = asyncHandler(async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName });

    if (user) {
        res.json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
        });
    } else {
        res.status(404);
        throw new Error("Korisnik nije pronađen!");
    }
});




//post
const createUser = async (req, res) =>{
    const {firstName, lastName, email, userName, password, isArtist} = req.body

    try {
        const korisnik = await User.create({firstName, lastName, email, userName, password, isArtist})
        res.status(200).json(korisnik)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//delete
const deleteUser = async (req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'Nema korisnik sa tim ID-em'})
    }

    const korisnik = await User.findOneAndDelete({_id: id})

    if(!korisnik) {
        return res.status(404).json({error:'Korisnik sa tim ID-em nije u postojanju'})
    }

    res.status(200).json(korisnik)
}

//updateUser je metoda koja se koristi u admin panelu - treba proveriti validnosti podataka kao kod signup 
const updateUser = async (req, res)=>{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'Nema korisnik sa tim ID-em'})
    }

    const korisnik = await User.findOneAndUpdate({_id:id}, {
        ...req.body
    })
    
    if(!korisnik) {
        return res.status(404).json({error:'Korisnik sa tim ID-em nije u postojanju'})
    }

    res.status(200).json(korisnik)
}

//login
const loginUser = async (req, res) => {
    const {email,password} = req.body
    try {
        const user = await User.login( email, password)
        // const pod = User.findOne({mail})
         //token
        const token = createToken(res,user._id)
        
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            isArtist: user.isArtist,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//singup
const signupUser = async (req,res) => {
    const { firstName, lastName, email, userName, password, isArtist } = req.body

   

    try {
        const user = await User.signup(firstName, lastName, email, userName, password, isArtist)
         //token
        const token = createToken(res,user._id)

        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            isArtist: user.isArtist,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

//logout zbog cookia
const logoutCurrentUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({message: "Logout uspšan"})
});

//admin get za sve
const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find({});
    res.json(users);
})

//admin get za jednog
const getCurrentUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            username: user.userName,
            email: user.email
        })
    }
    else {
        res.status(404);
        throw new Error("Korisnik nije pronadjen!")
    }
})

//update za korisnika
const updateCurrentUserProfile = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.user._id)

    if(user){
        user.firstName = req.body.firstName || user.firstName
        user.lastName = req.body.lastName || user.lastName
        user.userName=req.body.userName || user.userName
        user.email = req.body.email || user.email
        user.isArtist = req.body.isArtist || user.isArtist

        if(req.body.password) {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(req.body.password, salt)
            user.password=hash;
        }
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            userName: updatedUser.userName,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isArtist: updatedUser.isArtist
        })
    }
    else{
        res.status(404)
        throw new Error("Korisnik nije pronadjen");
    }
})

//admin delete
const deleteUserById = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id)

    if (user) {
        if(user.isAdmin) {
            res.status(400)
            throw new Error('Admin se ne moze obrisati')
        }

        await User.deleteOne({_id: user._id})
        res.json({message: "Korisnik uklonjen"})
    } else {
        res.status(404);
        throw new Error("Korisnik nije pronadjen")
    }
    
})

const addAuctionToOrderList = asyncHandler(async (req, res) => {
    const { userId, auctionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        return res.status(400).json({ error: 'Invalid auction ID' });
    }

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    if (!user.orderList.includes(auctionId)) {
        user.orderList.push(auctionId);
        await user.save();

        req.app.get('io').emit('addedAuction', auctionId);

        res.status(200).json({ message: 'Auction added to order list successfully', user });
    } else {
        res.status(400).json({ error: 'Auction already in order list' });
    }
});

const removeAuctionFromOrderList = asyncHandler(async (req, res) => {
    const { userId, auctionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        return res.status(400).json({ error: 'Invalid auction ID' });
    }

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const auctionIndex = user.orderList.indexOf(auctionId);

    if (auctionIndex > -1) {
        user.orderList.splice(auctionIndex, 1);
        await user.save();
        res.status(200).json({ message: 'Auction removed from order list successfully', user });
    } else {
        res.status(400).json({ error: 'Auction not found in order list' });
    }
});

const getUserOrderList = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(id)
    .populate({
        path:'orderList',
        populate:[
            {
              path: 'artist',
              select: 'userName'
            },
            {
              path: 'topBidder',
              select: 'userName'
            }
          ],
        select: 'name category subcategory dimensions price image country auc_start auc_ends status'
    });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.orderList);
});

module.exports = {
    getUsers,
    getUser,
    getUserByUserName,
    createUser,
    deleteUser,
    updateUser,
    loginUser,
    signupUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUser,
    updateCurrentUserProfile,
    deleteUserById,
    addAuctionToOrderList,
    removeAuctionFromOrderList,
    getUserOrderList
}