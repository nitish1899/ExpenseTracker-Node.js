const Razorpay = require('razorpay');
const Order = require('../models/orders');
require("dotenv").config();

const purchasepremium = async (req,res) => {
    try{
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
        rzp.orders.create({amount}, (err,order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({order, key_id: rzp.key_id});
            }).catch(err => {
                throw new Error(err);
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({message : 'Something went wrong', error : err});
    }
}

const updateTransactionStatusSuccess = (req,res) => {
    try {
        const {order_id, payment_id} = req.body;
        Order.findOne({where : {orderid: order_id}}).then(order => {
        order.update({ paymentid : payment_id, status: 'SUCCESSFUL'}).then(() => {
            req.user.update({ispremiumuser: true}).then(() => {
               return res.status(202).json({status : true, message : " Tranction Successful"});
            }).catch((err) => {
                throw new Error(err);
               });

        }).catch((err) => {
            throw new Error(err);
           });
        }).catch((err) => {
            throw new Error(err);
           });

    } catch(err)  {
        console.log(err);
        res.status(403).json({message : 'Something went wrong', error : err});
    } 
}

const updatetransactionstatusFail = (req,res) => {
    try {
        const {order_id} = req.body;
        Order.findOne({where : {orderid: order_id}}).then(order => {
        order.update({ status: 'UNSUCCESSFUL'}).then(() => {
            req.user.update({ispremiumuser: false}).then(() => {
               return res.status(202).json({status : true, message : " Tranction Fail"});
            }).catch((err) => {
                throw new Error(err);
               });

        }).catch((err) => {
            throw new Error(err);
           });
        }).catch((err) => {
            throw new Error(err);
           });

    } catch(err)  {
        console.log(err);
        res.status(403).json({message : 'Something went wrong', error : err});
    } 
}

module.exports = {purchasepremium, updateTransactionStatusSuccess, updatetransactionstatusFail};