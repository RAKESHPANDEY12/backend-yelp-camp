const User=require("../models/user")

module.exports.registerUser=(req,res)=>{
    res.render("user/register.ejs")
}

module.exports.registerdUser=async(req,res)=>{
    try{
     const {email,username,password}=req.body;
 const user=new User({email,username})
 const foundUser=await User.register(user,password);
 req.login(foundUser,err=>{
     if(err)next(err)
 res.redirect("/campgrounds")
 })}catch(e){
     req.flash("success",e.message)
     res.redirect("/register")
 }
 }

 module.exports.login=(req,res)=>{
    res.render("user/login.ejs")
    }

    module.exports.loggedInUser=(req,res)=>{
        req.flash('success', 'welcome back!');
        const redirectUrl = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }    