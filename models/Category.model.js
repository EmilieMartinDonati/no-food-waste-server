const { model, Schema } = require("mongoose");

const CategoryModel = new Schema({
  name: String,
  listings: [{ type: Schema.Types.ObjectId, ref: "listing" }],
});

module.exports = model("category", CategoryModel);