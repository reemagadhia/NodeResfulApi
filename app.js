const express = require('express');
const app = express(); //execute express like a function.
//Will spin up express app like a function where all utilities can be used.
const morgan = require('morgan'); //All reqs will be funnelled through morgan It is basically a  logger
const bodyParser = require('body-parser'); //parse the bodies of incoming req to make it formatted and easily readible
const mongoose = require('mongoose'); //to use with mongodb database

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
    // 'mongodb+srv://node-admin:node-admin@node-rest-shop-escy2.mongodb.net/test?retryWrites=true',
    // {
    //     useNewUrlParser: true
    // }
    'mongodb://localhost:27017/testdb',
    { useNewUrlParser: true }
).catch((error) => { console.log(error); }); //to get pwd dynamically so that we dont have to hardcore it in the code

mongoose.Promise = global.Promise;
//middlewares
app.use(morgan('dev')); //to use morgan

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//to handle CORS Errors
app.use((req, res, next) => { //doesn't send response just adjusts it
    res.header("Access-Control-Allow-Origin", "*") //* to give access to any origin
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next(); //so that other routes can take over
})

//app.use as a method acts as a middleware. Incoming request has to  pass through it.

app.use('/products', productRoutes); //anything starting with this url will be forwarded to products.js file
app.use('/orders', orderRoutes);

app.use((req, res, next) => { //if req reaches here means it couldn't be handled by the routes above
    const error = new Error('Not Found!');
    error.status  = 404;
    next(error);
});

app.use((error, req, res, next) => { //for all errors
    res.status(error.status || 500);
    res.json({
        error:{
            error: error.message
        }
    })
});

module.exports = app;