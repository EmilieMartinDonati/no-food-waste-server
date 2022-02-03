const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["user", "business"],
    default: "user",
  },
  bookings: [{ type: Schema.Types.ObjectId, ref: "booking" }],
  favorites: [{ type: Schema.Types.ObjectId, ref: "business" }],
});

module.exports = model("user", UserSchema);
