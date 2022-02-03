const { model, Schema } = require("mongoose");

const ListingModel = new Schema({
  name: { type: String, default: "No-waste basket" },
  owner: { type: Schema.Types.ObjectId, ref: "business" },
  price: { type: Number, required: true },
  availableQuantity: { type: Number, required: true },
  description: { type: String, required: true },
  archived: Boolean,
  recurring: Boolean,
  PublishedDate: Date,
});

module.exports = model("listing", ListingModel);
