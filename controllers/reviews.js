const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async(req, res) =>{
    const {id} = req.params;
        console.log("Review POST route - Listing ID:",req.params.id);

    const listing = await Listing.findById(id);
    if (!listing){
        throw new ExpreesErr(404, "Listing not foud");
    }
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
//  let listing = await Listing.findById(req.params.id);
 

 await newReview.save();
 await listing.save();
 req.flash("success", "New review added");
 res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview = async(req, res) =>{
    let{id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
};