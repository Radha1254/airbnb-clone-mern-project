const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpreesErr = require("../utils/ExpreesErr.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js");
const { validateReview, isloggedIn,isReviewAuthor} = require("../middleware.js");
//reviews route
//post route
router.post("/",isloggedIn, validateReview, wrapAsync(reviewController.createReview));
//delete review route
router.delete("/:reviewId",isloggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;

//mvc - model