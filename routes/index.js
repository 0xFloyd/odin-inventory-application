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

// GET request to delete Author.
router.get('/categories/:id/delete', category_controller.category_delete_get);

// POST request to delete Author.
router.post('/categories/:id/delete', category_controller.category_delete_post);

router.get('/categories/:id', category_controller.category_detail);

router.get('/categories', category_controller.category_list);

router.get('/items/create', item_controller.item_create_get);

router.post('/items/create', item_controller.item_create_post);

router.get('/items/:id/update', item_controller.item_update_get);

router.post('/items/:id/update', item_controller.item_update_post);

router.get('/items/:id/delete', item_controller.item_delete_get);

router.post('/items/:id/delete', item_controller.item_delete_post);

router.get('/items/:id', item_controller.item_detail);

router.get('/items', item_controller.item_list);



module.exports = router;
