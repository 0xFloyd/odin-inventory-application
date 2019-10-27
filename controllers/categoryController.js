var Item = require('../models/item');
var Category = require('../models/category');

var async = require('async');  

exports.index = function (req, res) {

    async.parallel({
        item_count: function (callback) {
            Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        category_count: function (callback) {
            Category.countDocuments({}, callback);
        },
    }, function (err, results) {
        res.render('index', { title: 'Inventory Application Home', error: err, data: results });
    });
};

// Display list of all items.
exports.category_list = function (req, res, next) {
    Category.find()
        .sort([['name', 'ascending']])
        .exec((err, list_categories) => {
            if (err) { return next(err); }
            // Success, render
            res.render('category_list', { title: 'Category List', categories_list: list_categories });  //view to render
        });

};

// Display detail page for a specific Author.
exports.category_detail = function (req, res, next) {

    async.parallel({
        category: function (callback) {
            Category.findById(req.params.id)
                .exec(callback)
        },
        category_items: function (callback) {
            Item.find({ 'category': req.params.id }, 'name description')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.category == null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
            res.render('category_detail', { title: 'Category Detail', category: results.category, category_items: results.category_items });
    });

};