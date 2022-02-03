const { model, Schema } = require("mongoose");

const BookingModel = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: "user" },
  listing: { type: Schema.Types.ObjectId, ref: "listing" },
  quantity: { type: Number, required: true },
});

module.exports = model("booking", BookingModel);
