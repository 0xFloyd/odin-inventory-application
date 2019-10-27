let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CategorySchema = new Schema ({
    name: {type: String, required: true, max: 100}
})

CategorySchema.virtual('url').get(function() {
    return '/categories/' + this._id;
});

module.exports = mongoose.model("Category", CategorySchema);