// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require("async");

var Category = require("./models/category");
var Item = require("./models/item");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var categories = [];
var items =[];

function categoryCreate(name, cb) {
    var category = new Category({ name: name });

    category.save(function(err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log("New Category: " + category);
        categories.push(category);
        cb(null, category);
    });
}


// cb = callback
function itemCreate(name, description, stock, price, category, cb) {
    itemdetail = {
        name: name,
        description: description,
        stock: stock,
        price: price
    };
    if (category != false) itemdetail.category = category;
  
    var item = new Item(itemdetail);
    item.save(function(err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log("New Item: " + item);
      items.push(item);
      cb(null, item);
    });
}


function createCategories(cb) {
    async.series(
      [
        function(callback) {
            categoryCreate("Shirts", callback);
        },
        function(callback) {
            categoryCreate("Pants", callback);
        },
        function(callback) {
            categoryCreate("Socks", callback);
        }
      ],
      // optional callback
      cb
    );
  }

function createItems(cb) {
  async.parallel(
    [
      function(callback) {
          itemCreate(
          "Jogging Pants",
          "A nice pair of pants perfect for running",
          85,
          10.95,
          categories[1],
          callback
        );
      },
      function(callback) {
          itemCreate(
              "Long Sleeve Polo",
              "A nice shirt meant for colder weather",
              120,
              20.95,
              categories[0],
          callback
        );
      },
      function(callback) {
          itemCreate(  
          "Johnny Fish Socks",
          "A nice pair of the finest quality socks on earth from Johnny",
          9123,
          123,
          categories[2],
      callback);
      }
    ],
    // Optional callback
    cb
  );
}


async.series(
[createCategories, createItems],
// Optional callback
function(err, results) {
    if (err) {
    console.log("FINAL ERR: " + err);
    } else {
    console.log("Items: " + items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
}
);
  