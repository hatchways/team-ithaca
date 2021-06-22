const ObjectId = require("mongoose").Types.ObjectId;
const asyncHandler = require("express-async-handler");
const Profile = require("../models/Profile");
const Review = require("../models/Review");

// @route POST /review/:id
// @Given parameters passed in, create a review.
exports.createReview = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  
  if (!ObjectId(userId)) {
    return res.status(400).send(Error("User id is invalid"));
  }

  if (userId === req.body.userId) {
    return res.status(401).json({
      error: "User is not authorized for reviewing their own profile"
    });
  }

  try {
    const newReview = new Review(req.body);
    newReview.save((error, review) => {
      if (error) {
        return res.status(400).json({
          error: "Error in saving the review",
          message: error.message
        });
      }

      return res.status(200).json({
        success: "Review is submitted successfully."
      })

    });
    res.status(200).json({
      success: {
        review: newReview,
      },
    });
  } catch (e) {
    res.status(500);
    throw new Error(e.message);
  }
});

exports.getAvgUserReview = asyncHandler(async (req, res, next) => {
  Review.aggregate(
    [
      { $group: { _id: "$userId", avgRating: { $avg: "$rating" } } }
    ]
  ).exec((error, reviews) => {
    if (error) {
      return res.status(400).json({
        error: "error in getting reviews",
        message: error.message
      })
    }

    return res.status(200).json({
      success: "Retrieved successfully",
      reviews
    })
  })
})

// @route GET /review/:id
// @Given profile id, get all reviews
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  const profileId = req.params.id;

  if (!ObjectId(profileId)) {
    return res.status(400).send(Error("Profile id is invalid"));
  }

  try {
    const sitterProfile = await Profile.findById(profileId).populate("review");
    res.status(200).json({
      success: {
        reviews: sitterProfile.review,
      },
    });
  } catch (e) {
    res.status(500);
    throw new Error(e.message);
  }
});
