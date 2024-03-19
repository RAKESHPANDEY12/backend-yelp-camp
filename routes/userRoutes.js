const express = require("express");
const user = require("../controllers/user");
const router=express.Router()
const passport=require("passport")


router.route("/register")
    .get(user.registerUser)
.post(user.registerdUser)

router.route("/login")
.get(user.login)
.post(passport.authenticate("local",{failureFlash:true,failureRedirect:"/login",keepSessionInfo: true}),user.loggedInUser)

module.exports=router;