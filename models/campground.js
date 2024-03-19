const mongoose=require("mongoose")
const Schema=mongoose.Schema
const Review = require('./review')
const User = require('./user')
const { string } = require("joi")
const imageSchema=new Schema({
    url:String,
    filename:String
})

// const opts = {toJSON: { virtuals: true } };
const campgroundSchema=new Schema(
{
    title:String,
    price:Number,
    description:String,
    location:String,
    geometry: {
        type:{
            type:String,
            enum:["Point"],
            required:true
        } ,
        coordinates: {
            type:[Number],
            required:true}
        },
    image:[imageSchema],
    author:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
        reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    properties:{
        popUpMarker:{
            type:String,
    }
    }
}
)
imageSchema.virtual("thumbnail").get(function(){
   return this.url.replace("/upload","/upload/w_100")
})
 
// campgroundSchema.virtual('properties.popUpMarker').get(function(){
// return `<a href="/campground/${this._id}">${this.title}</a>`
// })

campgroundSchema.post("findOneAndDelete",async function(campground){
    if(campground){
        await Review.deleteMany({
            _id:{
                $in:campground.reviews
            }
        })
    }
})

const Campground=mongoose.model("Campground",campgroundSchema)

module.exports=Campground;