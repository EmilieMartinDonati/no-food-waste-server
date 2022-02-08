const { model, Schema } = require("mongoose");

const ListingModel = new Schema({
  name: { type: String, default: "No-waste basket" },
  owner: { type: Schema.Types.ObjectId, ref: "business" },
  price: { type: Number, required: true },
  availableQuantity: { type: Number, required: true },
  description: { type: String, required: true },
  archived: { type: Boolean, default: false },
  recurring: { type: Boolean, default: true },
  publishedDate: { type: Date, default: new Date(), required: true},
});

module.exports = model("listing", ListingModel);
