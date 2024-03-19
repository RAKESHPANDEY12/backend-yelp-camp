const mongoose=require("mongoose")
const {Schema}=mongoose

mongoose.connect("mongodb://127.0.0.1:27017/relationshipDemo")
.then(()=>{
    console.log("connected to mongoose")
}).catch((err)=>{
    console.log(`connection fail:${err}`)
})

const productSchema=new Schema({
    name:String,
    state:String,
    price:Number
 })
 
 const farmSchema=new Schema({
     name:String,
     country:String,
     products:[{ type: Schema.Types.ObjectId, ref: 'Product' }]
    })
    
    const Product=mongoose.model("Product",productSchema)
    const Farm=mongoose.model("Farm",farmSchema)

//     Product.deleteMany({})
// Product.insertMany([
//         {name:"potato",state:"u.p",price:23},
//     {name:"brinjal",state:"haryana",price:77},
//     {name:"tomato",state:"punjab",price:44}
// ]) 

// const makefarm=async()=>{
//     const farm=new Farm({
//         name:"vegetable",
//         country:"india"
//     })
//     const potato=await Product.findOne({name:"potato"})
// console.log(potato);
// await farm.products.push(potato);
// await farm.save()
// }
// // makeProduct();
// makefarm();

Farm.findOne({ name: 'vegetable' })
    .populate('products')
    .then(farm => console.log(farm))