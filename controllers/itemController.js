var Item = require('../models/item');
var Category = require('../models/category');

var async = require('async');


// Display list of all items.
exports.item_list = function (req, res, next) {
    Item.find()
        .populate('category')
        .exec(function (err, list_items) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('item_list', { title: 'Item List', items_list: list_items });
        });

};