var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware/");


router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req, res) {
    Campground.findById(req.params.id,function(err,elem){
        if(err) console.log(err);
        else res.render("comments/new",{ camp:elem });
    });
});

router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   var text=req.body.text;
   var author=req.body.author;
   var newComment={
       author:author,
       text:text
   };
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           req.flash("error","Sorry! Something went wrong! :(");
           res.redirect("/campgrounds");
       } else {
        Comment.create(newComment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id=req.user._id;
               comment.author.username=req.user.username;
                //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success","Successfully added comment!");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

//COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comment/:comm_id/edit",middleware.checkOwnerComment,function(req,res){
    Comment.findById(req.params.comm_id,function(err,comm){
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit",{camp_id:req.params.id,comm:comm});
        }
    });
    
});

//COMMENT UPDATE ROUTE
//doesn't work :( 
router.put("/campgrounds/:id/comments/:comm_id",middleware.checkOwnerComment,function(req,res){
  Comment.findByIdAndUpdate(
      req.params.comm_id,
      req.body.text,
      {
          'new':true
          
      },
      function(err,updated){
        if(err) {
           console.log(err);
        }else{
            req.flash("success","Comment successfully edited!");
            res.redirect("/campgrounds/"+req.params.id);
        }
     });
});

//DELETE COMMENT
router.delete("/campgrounds/:id/comments/:comm_id/delete",middleware.checkOwnerComment,function(req,res){
   Comment.findByIdAndRemove(req.params.comm_id,function(err){
       if(err){
           console.log(err);
       }else{
           req.flash("success","Comment successfully deleted!");
           res.redirect("/campgrounds");
       }
   }) ;
});

module.exports=router;