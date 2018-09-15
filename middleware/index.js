var Campground=require("../models/campground");
var Comment   =require("../models/comment");

//All middleware cames here
var middlewareObj={
    
};

middlewareObj.checkOwnerCampground=function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,elem){
           if(err) console.log(err);
           else{
               if(elem.author.id.equals(req.user.id)){  //req.user.id este un obiect. =>equals()
                   next();
               }else{
                   req.flash("error","You don't have permission to do that!");
                   res.redirect("back");
               }
           }
        });
    }else{
        req.flash("error","You need to be authenticated to do that!");
        res.redirect("back");
    }
};
    

middlewareObj.checkOwnerComment=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comm_id,function(err,elem){
            if(err) console.log(err);
            else{
                if(elem.author.id.equals(req.user._id)){
                   next(); 
                }else{
                    req.flash("error","You need to be authenticated to do that!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
    
};
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","Sorry!You need to be logged in to do that!");
        res.redirect("/login");
    }
};








module.exports=middlewareObj;