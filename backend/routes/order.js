const express = require('express')
const router = express.Router();

const {
  createOrder, 
  getOrders, 
  getOrderById, 
  deleteOrderById, 
  updateOrderDeliveryStatus,
  getOrderByAuctionId
} = require("../controlers/orderController.js");




const {authenticate, authorizeAdmin} = require('../middlewares/errorMiddleware')

router.post('/', authenticate, createOrder);

router.get('/', authenticate, authorizeAdmin, getOrders);

router.get('/:id', authenticate, getOrderById);

router.get('/auction/:auctionId', authenticate, getOrderByAuctionId);

router.delete('/:id', authenticate, authorizeAdmin, deleteOrderById);

router.put('/:id/deliver', authenticate, updateOrderDeliveryStatus);


 module.exports=router