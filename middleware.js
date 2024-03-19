const {campgroundSchema,reviewSchema} = require("./schema")
const Review= require("./models/review");
const Campground = require("./models/campground")
const ExpressError = require("./utils/ExpressError")


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('errors', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor=async(req,res,next)=>{
    const{id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author._id.equals(req.user._id)){
     req.flash("errors","you don't have permission to update campground")
     return res.redirect(`/campground/${campground.id}`)
    }
    next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const{ id,reviewId}=req.params;
    const campground=await Campground.findById(id);
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
     req.flash("errors","you don't have permission to delete campground")
     return res.redirect(`/campground/${campground.id}`)
    }
    next();
}

module.exports.validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,404)
    }
    else{
        next()
    }
}

module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,404)
    }
    else{
        next()
    }
}