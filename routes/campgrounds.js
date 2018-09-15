var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware/");

router.get("/",function(req,res){
    res.render("campgrounds/landing");    
});

//INDEX - Show all Campgrounds.
router.get("/campgrounds",function(req,res){
    // Show all elements from db
    
    Campground.find({},function(err,Elements){
        if(err) console.log(err);
        
        else { 
          res.render("campgrounds/index",{camp:Elements,currentUser:req.user});
     }
    });
});


//CREATE - add new campground to DB.
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    //get data from form and data from campground array
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var description=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    
    
    var newCampground={ 
                  name:name, 
                  price:price,
                  image:image,
                  description:description,
                  author:author
 };
    
   // campgrounds.push(newCampground);
  //   Create a new Campgrounds and save to DB.
  Campground.create(newCampground,function(err,elem){
      if(err) console.log(err);
      else {
          res.redirect("/campgrounds");
         
      }
  });
    
        //redirect to campgrounds page
       //res.redirect("/campgrounds");
});

//NEW - Show form to create new campground.
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new"); 
});


//  SHOW - Show more info about one Campground.
router.get("/campgrounds/:id",function(req, res) {
    //  Find the campground with the provided id
    //returnam un campground care contine si commenturile ,prin folosirea .populate.exec
    Campground.findById(req.params.id).populate("comments").exec(function(err,FoundElem){
        if(err) {
            console.log(err);
        }
     //   Render show the template with that campground
     else{
         res.render( "campgrounds/show" , { camp : FoundElem });
     }
        
    });
  
});

//EDIT campground route
router.get("/campgrounds/:id/edit",middleware.checkOwnerCampground, function(req, res){
    Campground.findById(req.params.id,function(err,FoundElem){
                 if(err){
                    console.log(err);
                   } else{
                      res.render("campgrounds/edit",{elem:FoundElem});
                  }
  });
});

router.put("/campgrounds/:id/edit",middleware.checkOwnerCampground,function(req,res){
    var EditedData={
        name:req.body.name,
        price:req.body.price,
        image:req.body.image,
        description:req.body.description
    };
   Campground.findByIdAndUpdate(req.params.id,EditedData,function(err,updated){
       err ? console.log(err) : res.redirect("/campgrounds/"+req.params.id);
   });
    
});


//DELETE data from campground.
router.delete("/campgrounds/:id",middleware.checkOwnerCampground,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        err ? console.log(err) : res.redirect("/campgrounds");
    });
});





module.exports=router;

