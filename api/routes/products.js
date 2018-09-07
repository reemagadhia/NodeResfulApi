const express =  require('express');
const router = express.Router(); ///subpackage that provides different capabilities to handle different routes
const mongoose = require('mongoose');

const Product = require('../models/products')
router.get('/', (req, res, next) => {
    Product.find()
           .select('name price _id') //to fetch selected data only
           .exec()
           .then(docs =>{
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            request:{
                                type: 'GET',
                                url: 'http://localhost:3000/products/'+ doc._id
                            }
                        }
                    })
                }
                if(docs.length >= 0){
                    res.status(200).json(response); //json object. Content in it will be automatically stringify.
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
    const product = new Product({  //passing values as a constructor
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then( result =>{
        console.log(result);
        res.status(200).json({ //json object. Content in it will be automatically stringify.
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/'+ result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
     });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
           .select('name price _id')
           .exec()
           .then(doc => {
                console.log(doc);
                if(doc != null){
                    res.status(200).json({doc})
                }else{
                    res.status(404).json({message: "No valid entry found for provided Id"})
                }
           })
           .catch(err => {
               console.log(err);
               res.status(500).json({error: err});
           });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndUpdate(id, req.body, {new: true})
           .exec()
           .then(result =>{
                res.status(200).json({
                    message: 'Product updated',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'+ result._id
                    }
                })
           })
           .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
           });

});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id})
           .exec()
           .then(result =>{
                console.log(result);
                res.status(200).json({
                    message: 'Product deleted'
                })
            })
           .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
 });

module.exports = router;