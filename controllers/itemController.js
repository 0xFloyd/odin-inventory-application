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

// Display detail page for a specific book.
exports.item_detail = function (req, res) {
    async.parallel({
        item: function (callback) {
            Item.findById(req.params.id)
                .populate('category')
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.item == null) { // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('item_detail', { Name: results.item.name, item: results.item });
    });
};