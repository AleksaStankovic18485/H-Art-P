const formidable = require("express-formidable");
const express = require('express')

const {
    getAuctions,
    getAuction,
    createAuction,
    deleteAuction,
    updateAuction
} = require('../controlers/auctionController')

const {authenticate} = require('../middlewares/errorMiddleware')

const router = express.Router()

        router.get('/', getAuctions)

        router.get('/:id', getAuction)

        router.post('/',formidable(), createAuction) //treba ovde formidable()

        router.delete('/:id', deleteAuction)

        router.patch('/:id',updateAuction)


module.exports=router