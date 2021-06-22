const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema;

const reviewSchema = new mongoose.Schema({
  reviewerUserId: {
    type: ObjectId,
    ref: "user",
    unique: true,
    requried: true
  },
  userId: {
    type: ObjectId,
    ref: "user",
    unique: true,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  requestId: {
    type: ObjectId,
    ref: "request",
    required: true
  }
},{ timestamps: true });

module.exports = Review = mongoose.model("review", reviewSchema);
