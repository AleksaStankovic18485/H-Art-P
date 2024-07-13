const express = require('express')
const {authorizeAdmin, authenticate} = require('../middlewares/errorMiddleware')
const {
    getUsers,
    getUser,
    getUserByUserName,
    createUser,
    deleteUser,
    updateUser,
    loginUser,
    signupUser,
    getAllUsers,
    logoutCurrentUser,
    getCurrentUser,
    updateCurrentUserProfile,
    deleteUserById,
    addAuctionToOrderList,
    removeAuctionFromOrderList,
    getUserOrderList
} = require('../controlers/userController')


const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser) //.get(authorizeAdmin,getAllUsers)


router.get('/adminGetUsers', authenticate,authorizeAdmin,getAllUsers) //admin get users ruta, usersApiSlice -> getUsers
router.get('/profile', authenticate,getCurrentUser)

//update
router.put('/profileUpdate', authenticate, updateCurrentUserProfile) 

router.delete('/delete/:id',authenticate, authorizeAdmin, deleteUserById) //admin delete user ruta, usersApiSlice -> deleteUser

router.post('/logout', logoutCurrentUser)

router.get('/', authenticate, authorizeAdmin, getUsers)

router.get('/:id', getUser)
router.get('/username/:userName', getUserByUserName);

router.post('/', createUser)

router.delete('/:id', deleteUser)
router.patch('/:id', authenticate, authorizeAdmin,updateUser) //admin update ruta, usersApiSlice -> updateUser

router.post('/addAuctionToOrderList', addAuctionToOrderList);
router.delete('/orderList/remove', removeAuctionFromOrderList);
router.get('/:id/orderlist', getUserOrderList);
module.exports=router