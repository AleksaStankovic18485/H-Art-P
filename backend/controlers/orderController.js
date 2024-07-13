
const Order = require('../models/orderModel.js');
const Auction = require('../models/auctionModel.js')


const calculateTax = (itemPrice) => {
  return itemPrice * 0.1;
};

const createOrder = async (req, res) => {
  try {

    const {orderItem, shippingAddress } = req.body;
 
  
    const auction = await Auction.findById(orderItem);
    
    if (!auction) {
      return res.status(404).json({ error: 'Aukcija nije pronađena' });
    }
    let itemPrice = auction.price;
    let shippingPrice = itemPrice > 100 ? 0 : 25; 
    let taxPrice = calculateTax(itemPrice); 
    let totalPrice = itemPrice + shippingPrice + taxPrice; 

    const order = await Order.create({
        user: req.user._id,
        orderItem,
        itemPrice,
        shippingAddress,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
      const orders = await Order.find().populate('user', 'firstName lastName userName').populate('orderItem');
      res.status(200).json(orders);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
      const order = await Order.findById(id).populate('user', 'firstName lastName userName').populate('orderItem');
      if (!order) {
          return res.status(404).json({ error: 'Narudžbina nije pronađena' });
      }
      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const deleteOrderById = async (req, res) => {
  const { id } = req.params;
  try {
      const order = await Order.findByIdAndDelete(id);
      if (!order) {
          return res.status(404).json({ error: 'Narudžbina nije pronađena' });
      }
      res.status(200).json({ message: 'Narudžbina uspešno obrisana' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
const updateOrderDeliveryStatus = async (req, res) => {
  const { id } = req.params;
  const { isDelivered } = req.body;
  try {
      const order = await Order.findById(id);
      if (!order) {
          return res.status(404).json({ error: 'Narudžbina nije pronađena' });
      }

      order.isDelivered = isDelivered;
      order.deliveredAt = isDelivered ? new Date() : null; // Postavljanje trenutnog datuma ako je narudžbina isporučena, inače null

      await order.save();

      req.app.get('io').emit('updateOrder', order);

      res.status(200).json({ message: 'Status isporuke narudžbine uspešno ažuriran', order });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const getOrderByAuctionId = async (req, res) => {
  const { auctionId } = req.params;
  try {
      const order = await Order.findOne({ orderItem: auctionId }).populate('user', 'firstName lastName userName').populate('orderItem');
      if (!order) {
          return res.status(404).json({ error: 'Narudžbina nije pronađena' });
      }
      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



module.exports = { 
  createOrder, 
  getOrders, 
  getOrderById, 
  getOrderByAuctionId,
  deleteOrderById, 
  updateOrderDeliveryStatus 
};