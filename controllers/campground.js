const Campground = require("../models/campground")
const Review= require("../models/review");
const multer  = require('multer')
const {cloudinary}=require("../Cloudinary/index")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapbox_accessToken=process.env.MAPBOX_ACCESSTOKEN
const geoCoder = mbxGeocoding({accessToken:mapbox_accessToken});


module.exports.home= (req, res) => {
    const{name="colt"}=req.query
       res.render("campgrounds/home.ejs")
}
module.exports.allCampground=async (req, res, next) => {
  const campgrounds = await Campground.find({})
  res.render("campgrounds/index", { campgrounds })
}
module.exports.new=(req, res) => {
   res.render("campgrounds/new")
}
module.exports.createCampground=async (req, res) => {
    const geoData=await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      })
        .send()
        const newCampground = await new Campground(req.body.campground)
      newCampground.geometry= geoData.body.features[0].geometry
        newCampground.image=req.files.map(f=>({url:f.path,filename:f.filename}))
    newCampground.author=req.user._id   
            // newCampground.populate("author")   
    await newCampground.save();
    req.flash("success","New Campground Added")
    res.redirect(`/campground/${newCampground.id}`);
}

module.exports.showCampground=async (req, res, next) => {
    const { id } = req.params
   const campground = await Campground.findById(id).populate(
 {   path:"reviews",
    populate:{
        path:"author"
    }
}).populate("author");
     if(!campground) {
req.flash("errors","Campground Not Found")
return res.redirect("/campgrounds")
}
    res.render("campgrounds/show", { campground })
}

module.exports.editCampground=async(req, res, next) => {
      const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash("errors","Campground Not Found")
       return res.redirect("/campgrounds")
        }
    res.render("campgrounds/edit", { campground })
}

module.exports.deleteCampground=async (req, res) => {
    const campground = await Campground.findById(req.params.id);
        if(!campground) {
        req.flash("errors","Campground Not Found")
       return res.redirect("/campgrounds")
        }
    res.render("campgrounds/show", { campground })
}

module.exports.createReview=async(req,res)=>{
    const {review}=req.body;
    const campground = await Campground.findById(req.params.id);
    const reviews=await new Review(review);
    reviews.author=req.user._id
    // await reviews.populate("author")
    campground.reviews.push(reviews);
    await reviews.save()
    await campground.save()
    res.redirect(`/campground/${campground.id}`)
}
module.exports.deletedCampground=async(req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    req.flash("success","Deleted Campground Successfully")
   res.redirect("/campgrounds");
}
module.exports.deletedReview=async(req, res) => {
    const{id,reviewId}=req.params
    const campground = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId)
   res.redirect(`/campground/${campground.id}`);
}
module.exports.updateCampground=async (req, res) => {
       const{id}=req.params
    const updatedCampground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const img=req.files.map(f=>({url:f.path,filename:f.filename}))
    updatedCampground.image.push(...img)
    if(req.body.deleteImage){
        for(filename of req.body.deleteImage){
         await cloudinary.uploader.destroy(filename)
        }
      await updatedCampground.updateOne({$pull:{image:{filename:{$in:req.body.deleteImage}}}})
    }
    await updatedCampground.save()
    // await updatedCampground.save();
    req.flash("success","Campground Updated Successfully")
    res.redirect(`/campground/${updatedCampground.id}`);
}

module.exports.logOut=function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/campgrounds');
    });
  }