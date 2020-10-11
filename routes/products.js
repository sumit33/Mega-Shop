const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');


 /* Get all Products from database*/
router.get('/', function(req, res) {
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;
  let startvalue,endvalue;
  if (page>0) {
    startvalue = (page*limit) - limit;
    endvalue = page*limit;
  }
  else{
    startvalue = 0;
    endvalue = 10;
  }

  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: 'c.id = p.cat_id'
  }])
    .withFields(['c.title as category',
    'p.title as name',
    'p.price',
    'p.quantity',
    'p.description',
    'p.image',
    'p.id'
  ])
    .slice(startvalue,endvalue)

    .sort({id: .1})

    .getAll()

    .then(prods=>{
      if(prods.length>0){
        res.status(200).json({
          count: prods.length,
          products: prods
        });
      }else{
        res.json('No products found');
      }
    })

    .catch(err => console.log(err));
});

/* Get single products  */

router.get('/:prodID',(req,res) => {
  const productID = req.params.prodID;
  console.log(productID);
  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: 'c.id = p.cat_id'
  }])
    .withFields(['c.title as category',
    'p.title as name',
    'p.price',
    'p.quantity',
    'p.description',
    'p.image',
    'p.images',
    'p.id'
  ])
    .filter({'p.id': productID})

    .get()

    .then(prod=>{
      if(prod){
        res.status(200).json(prod);
      }else{
        res.json({message: `No product found with id ${productId}`});
      }
    })

    .catch(err => console.log(err));
})

/* Get all products with same category */

router.get('/category/:catName', (req,res) => {

  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;

  let startvalue,endvalue;

  if (page>0) {
    startvalue = (page*limit) - limit;
    endvalue = page*limit;
  }
  else{
    startvalue = 0;
    endvalue = 10;
  }

  const cat_title = req.params.catName;

  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
  }])
    .withFields(['c.title as category',
    'p.title as name',
    'p.price',
    'p.quantity',
    'p.description',
    'p.image',
    'p.id'
  ])
    .slice(startvalue,endvalue)

    .sort({id: .1})

    .getAll()

    .then(prods=>{
      if(prods.length>0){
        res.status(200).json({
          count: prods.length,
          products: prods
        });
      }else{
        res.json({message: `No product found from ${productId} category`});
      }
    })

    .catch(err => console.log(err));
});

module.exports = router;
