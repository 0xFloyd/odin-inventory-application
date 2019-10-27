var Item = require('../models/item');
var Category = require('../models/category');
const validator = require('express-validator'); 

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

exports.category_create_get = function (req, res, next) {
    res.render('category_form', { title: 'Create Category' });
};

// Handle Category create on POST.
exports.category_create_post = [

    // Validate that the name field is not empty.
    validator.body('name', 'Category name required').isLength({ min: 1 }).trim(),

    // Sanitize (escape) the name field.
    validator.sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validator.validationResult(req);

        // Create a Category object with escaped and trimmed data.
        var category = new Category(
            { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('category_form', { title: 'Create Category', category: category, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            // Check if Category with same name already exists.
            Category.findOne({ 'name': req.body.name })
                .exec(function (err, found_category) {
                    if (err) { return next(err); }

                    if (found_category) {
                        // Category exists, redirect to its detail page.
                        res.redirect(found_category.url);
                    }
                    else {

                        category.save(function (err) {
                            if (err) { return next(err); }
                            // Category saved. Redirect to Category detail page.
                            res.redirect(category.url);
                        });

                    }

                });
        }
    }
];