const Auction = require('../models/auctionModel')
const mongoose = require('mongoose')

//get dela
const getAuctions = async (req,res)=>{
    try {
        const auctions = await Auction.find({})
            .sort({ createdAt: -1 })
            .populate('artist', 'userName email') 
            .populate('topBidder', 'userName email'); 

        res.status(200).json(auctions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//get {ID} dela
const getAuction = async (req,res)=>{
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Nema umetnina sa tim ID-em' });
    }

    try {
        const auction = await Auction.findById(id)
            .populate('artist', 'userName email') 
            .populate('topBidder', 'userName email'); 

        if (!auction) {
            return res.status(404).json({ error: 'Umetnina sa tim ID-em nije u postojanju' });
        }

        res.status(200).json(auction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//post


const createAuction = async (req, res) => {
    const { name, category, subcategory, dimensions, price, artist, image, country, auc_start, auc_ends } = req.fields;

    try {
        const aukcija = new Auction({ ...req.fields });
        await aukcija.save();

        // Emitovanje događaja za novu aukciju
        req.app.get('io').emit('newAuction', aukcija);

        res.status(200).json(aukcija);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//delete
const deleteAuction = async (req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'Nema umetnina sa tim ID-em'})
    }

    const aukcija = await Auction.findOneAndDelete({_id: id})

    if(!aukcija) {
        return res.status(404).json({error:'Umetnina sa tim ID-em nije u postojanju'})
    }

    res.status(200).json(aukcija)
}

//update
const updateAuction = async (req, res)=>{
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Nema umetnina sa tim ID-em' });
    }

    try {
        const aukcija = await Auction.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true } 
        ).populate('topBidder', 'userName');


        if (!aukcija) {
            return res.status(404).json({ error: 'Umetnina sa tim ID-em nije u postojanju' });
        }

        req.app.get('io').emit('auctionUpdate', aukcija);

        res.status(200).json(aukcija);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    getAuctions,
    getAuction,
    createAuction,
    deleteAuction,
    updateAuction
}