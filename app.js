var express          = require("express");
var app              = express();
var bodyParser       = require("body-parser");
var mongoose         = require("mongoose");
var methodOverride   = require("method-override");
var flash            = require("connect-flash");

var passport         =require("passport");
var LocalStrategy    =require("passport-local");
var User             = require("./models/user.js");
// var seedsDB          = require("./seeds.js");

//     seedsDB();
var campgroundsRoutes     =require("./routes/campgrounds"),
    commentsRoutes        =require("./routes/comments"),
    indexRoutes           =require("./routes/index");
// Pentu local db
mongoose.connect(process.env.DATABASEURL);

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(flash());  //connect flash

//PASSWORD CONFIGURATION
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride("_method"));  //pentru UPDATE & DESTROY
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("error");   
   res.locals.success=req.flash("success");
   next();
});


app.use(indexRoutes);
app.use(commentsRoutes);
app.use(campgroundsRoutes);
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server started!");
});