const { model, Schema } = require("mongoose");

const BusinessSchema = new Schema({
  owwner: { type: Schema.Types.ObjectId, ref: "user" },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  picture: { type: String },
  listings: [{ type: Schema.Types.ObjectId, ref: "listing" }],
  tags: { type: [String], enum: ["Restaurant", "Bakery", "Supermarket"] },
  // pickupTimeSlots: { type: [Date], required: true },
});

module.exports = model("business", BusinessSchema);
