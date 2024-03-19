const express = require("express");
const campground = require("../controllers/campground");
const multer  = require('multer')
const{storage}=require("../Cloudinary/index")
const upload = multer({storage})
const router=express.Router()

const {isLoggedIn,isAuthor,validateCampground,validateReview,isReviewAuthor}= require("../middleware");
const catchAsync = require("../utils/CatchAsync")



router.get("/",campground.home)

router.get("/campgrounds", catchAsync(campground.allCampground))

router.route("/campground/new")
.get(isLoggedIn,campground.new)
.post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campground.createCampground))
// .post(upload.single('image'),(req,res)=>{
//     console.log(req.body,req.file)
// })

router.get("/campground/:id/edit",isLoggedIn,catchAsync(campground.editCampground))

router.get("/campground/:id/delete",catchAsync(campground.deleteCampground))

router.post("/campground/:id/review",isLoggedIn,validateReview,catchAsync(campground.createReview))


router.delete("/campground/:id/reviews/:reviewId",isReviewAuthor,catchAsync(campground.deletedReview))

router.route("/campground/:id")
.get(isLoggedIn,catchAsync(campground.showCampground))
.put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campground.updateCampground))
.delete(catchAsync(campground.deletedCampground))

router.get('/logout', campground.logOut)

module.exports=router