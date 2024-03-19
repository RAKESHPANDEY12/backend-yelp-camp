if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const mongoose=require("mongoose")
const cities=require("./cities")
const seeds=require("./seedHelpers")
const Campground=require("../models/campground")
const db_url=process.env.db_url
const cloudinary_secret=process.env.CLOUDINARY_CLOUDNAME
mongoose.connect(db_url)
.then(()=>{
    console.log("connected to mongoose")
}).catch((err)=>{
    console.log(`connection fail:${err}`)
})

const sample=array=>array[Math.floor(Math.random()*array.length)]
const seedDB=async()=>{
   await Campground.deleteMany({});
for(let i=0;i<=50;i++){
    let random1000=Math.floor(Math.random()*1000)
    let random10=Math.floor(Math.random()*10)
     const campground=new Campground({
      author:"65ca4a552d9ffabd10990263",
        location:`${cities[random1000].city},${cities[random1000].state}`,
        title:`${sample(seeds.descriptors)},${sample(seeds.places)}`,
        geometry: { type: 'Point', coordinates: [ cities[random1000].longitude,cities[random1000].latitude  ] },
        image:[{
              url: `https://res.cloudinary.com/${cloudinary_secret}/image/upload/v1708671328/yelp-camp/je985qcvg1lxezhvqao3.jpg`,
        filename: 'yelp-camp/je985qcvg1lxezhvqao3'}],
        price:random10,
        description:`Welcome to ${cities[random1000].state}`,
        properties:{popUpMarker:`${cities[random1000].city},${cities[random1000].state}`}
     })
     await campground.save()
     
}
     }

     seedDB().then(()=>{
        mongoose.connection.close()
     })
