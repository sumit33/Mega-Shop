
const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* Get all orders */

router.get('/' , (req,res) => {

    database.table('orders_details as od')
            .join([{
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username'])
        .sort({id: 1})
        .getAll()
        .then(orders=> {
            if(orders.length > 0){
                res.status(200).json(orders);
            }
            else{
                res.json("No order found");
            }
        })
        .catch((err) => {
            console.log(err);
        });
})

/*Get a single order */

router.get('/:id' , (req,res) => {
    const orderID = req.params.id;
    database.table('orders_details as od')
            .join([{
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username'])
        .filter({'o.id': orderID})
        .getAll()
        .then(order=> {
            if(order.length > 0){
                res.status(200).json(order);
            }
            else{
                res.json({message: `No product found with id ${orderID}`});
            }
        })
        .catch((err) => {
            console.log(err);
        });
})


/* Place a new order */

router.post('/new' , (req,res) => {

})

module.exports = router;