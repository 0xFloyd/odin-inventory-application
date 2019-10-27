var express = require('express');
var router = express.Router();

// controller modules
var item_controller = require('../controllers/itemController');
var category_controller = require('../controllers/categoryController');

/* GET home page. */

router.get('/', category_controller.index);

// GET request for creating a Category. NOTE This must come before route that displays Category (uses id).
router.get('/categories/create', category_controller.category_create_get);

router.post('/categories/create', category_controller.category_create_post);

router.get('/categories/:id', category_controller.category_detail);

router.get('/categories', category_controller.category_list);

router.get('/items/create', item_controller.item_create_get);

router.post('/items/create', item_controller.item_create_post);

router.get('/items/:id', item_controller.item_detail);

router.get('/items', item_controller.item_list);



module.exports = router;
