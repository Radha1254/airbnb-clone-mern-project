const Listing = require("../models/listing");

module.exports.index = async(req, res) =>{
 const allListing = await Listing.find({});
 res.render("listing/index.ejs", {allListing});
    
};
module.exports.createForm = async(req, res, next) =>{
    let url = req.file.path;
    let filename = req.file.filename;
const newListing = new Listing(req.body.listing);
newListing.owner = req.user._id;
newListing.image = {url, filename};
     await newListing.save();
     req.flash("success", "new listing created");
    res.redirect("/listings");
};
module.exports.renderEditForm = async(req,res)=>{
     let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error", "listing you requested for does not exist");
    return res.redirect("/listings");// return to stop execution

    }
    let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
     res.render("listing/edit.ejs", {listing, originalImageUrl});
};

module.exports.renderNewForm =  (req, res) =>{
res.render("listing/new.ejs");

};
module.exports.showListing = async (req, res) =>{
    let {id} = req.params;
    //use the id paramerter to fetch data or perform other operations
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
     populate: { 
    path: "author",
}
}).populate("owner");
    if(!listing){
    req.flash("error", "listing you requested for does not exist");
    return res.redirect("/listings");// return to stop execution

    }
    console.log(listing);
    res.render("listing/show.ejs", {listing});
};
module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async(req, res) =>{
    let {id} = req.params;
   let deletedlisting = await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
   req.flash("success", " listing deleted");
   res.redirect("/listings");
}
