const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review_text: {
      type: String,
      required: true,
    },
    review_images: [
      {
        type: String, // This will store URLs of the images
      },
    ],
    // Reference to the Property model
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Review", reviewSchema);
