const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orders')
router.get('/', (req, res, next) => {
    Order.find()
         .exec()
         .then(docs =>{
            console.log(docs);
            if(docs.length >= 1){
                res.status(200).json(docs);
            }else{
            res.status(404).json({message: "No entries found"})
        }
         })
         .catch(err => {
         console.log(err);
         res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    });
    order.save()
         .exec()
         .then( result =>{
            console.log(result);
            res.status(201).json({
                message: 'Order created',
                orderCreated: result
            });
         })
         .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
         });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
         .exec()
         .then(result => {
            console.log(result);
            if(result != null){
                res.status(200).json({"From database": result})
            }else{
                res.status(404).json({message: "No valid entry found for provided Id"})
            }
       })
       .catch(err => {
           console.log(err);
           res.status(500).json({error: err});
       });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findByIdAndRemove(id)
         .exec()
         .then(result => {
            console.log(result);
            res.status(200).json({"From database": result})
       })
       .catch(err => {
           console.log(err);
           res.status(500).json({error: err});
       });
});
module.exports = router;