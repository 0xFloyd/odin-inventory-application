var mongoose = require("mongoose");

var Schema = mongoose.Schema;

let ItemSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        stock: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            required: true,
            alias: 'i'
          },
          price: {type: Number, get: getPrice, set: setPrice, required: true },
          category: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
    }
);

function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}

ItemSchema.virtual("url").get(function() {
    return "/items/" + this._id;
  });

//Export model
module.exports = mongoose.model("Item", ItemSchema);