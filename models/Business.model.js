const { model, Schema } = require("mongoose");

const BusinessSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "user" },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  picture: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  },
  listings: [{ type: Schema.Types.ObjectId, ref: "listing" }],
  tags: [String],
  startTimeSlot: { type: Date },
  endTimeSlot: { type: Date },
});

module.exports = model("business", BusinessSchema);
