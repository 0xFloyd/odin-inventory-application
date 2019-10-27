var express = require('express');
var router = express.Router();

// controller modules
var item_controller = require('../controllers/itemController');
var category_controller = require('../controllers/categoryController');

/* GET home page. */

router.get('/', category_controller.index);

router.get('/categories', category_controller.category_list);

router.get('/items', item_controller.item_list);


module.exports = router;
