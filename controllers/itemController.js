var Item = require('../models/item');
var Category = require('../models/category');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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

// Display book create form on GET.
exports.item_create_get = function (req, res, next) {

    // Get all categories.
    async.parallel({
        categories: function (callback) {
            Category.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('item_form', { title: 'Create Item', categories: results.categories });
    });

};

// Handle book create on POST.
exports.item_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === 'undefined')
                req.body.category = [];
            else
                req.body.category = new Array(req.body.category);
        }
        next();
    },

    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('category', 'Category must not be empty.').isLength({ min: 1 }).trim(),
    body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
    body('stock', 'Stock must not be empty.').isLength({ min: 1 }).trim(),
    body('price', 'Price must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var item = new Item(
            {
                name: req.body.name,
                description: req.body.description,
                stock: req.body.stock,
                price: req.body.price,
                category: req.body.category
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                categories: function (callback) {
                    Category.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }

                res.render('item_form', { name: 'Create Item', categories: results.categories, item: item, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            item.save(function (err) {
                if (err) { return next(err); }
                //successful - redirect to new book record.
                res.redirect(item.url);
            });
        }
    }
];