const Listing = require("./models/listing");
const Review = require("./models/reviews");
const {listingSchema} = require("./schema.js");
const ExpreesErr = require("./utils/ExpreesErr.js");
const {reviewSchema} = require("./schema.js");

module.exports.isloggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async(req, res, next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.currUser._id)){
            req.flash("error", "you are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
};
module.exports.validateListing = (req, res,next) => {
    let {err} =  listingSchema.validate(req.body);
   if(err) {
    // let errMsg = error.details.map((el) =>el.message).join(",");
    throw new ExpreesErr(400, error);
   } else{
    next();
   }
};
module.exports.validateReview = (req, res,next) => {
    const {error} =  reviewSchema.validate(req.body);
   if(error) {
    let errMsg = error.details.map((el) =>el.message).join(",");
    throw new ExpreesErr(400, errMsg);
   } else{
    next();
   }
};
module.exports.isReviewAuthor = async(req, res, next) =>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
//
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error", "you are not the author of this Review");
            return res.redirect(`/listings/${id}`);
        }
        next();
};