const { model, Schema } = require("mongoose");

const ReviewSchema = new Schema ({
    content: { type: String, required: true },
    writer: { type: Schema.Types.ObjectId, ref: "user" }
})


module.exports = model("review", ReviewSchema);