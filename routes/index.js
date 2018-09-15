var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");



router.get("/register",function(req, res){
    res.render("register");
});

router.post("/register",function(req, res) {
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Wellcome to yelpcamp "+ user.username);
                res.redirect("/campgrounds");
            });
            
        }
    });
});

router.get("/login",function(req, res){
   res.render("login"); 
});


//nu se face log-in
router.post("/login",passport.authenticate("local",
{ 
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
    
}),function(req,res){});

router.get("/logout",function(req, res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});

module.exports=router;