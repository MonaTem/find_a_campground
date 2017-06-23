var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var flash = require("connect-flash");   //Will be used to add flash messages - needs to be before passport config.
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");
var User = require("./models/user");
var seedDB = require("./seeds");

//REQUIRE ROUTES
//========================================================================================
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

//Call the seedDB function
// seedDB();

//Passport Config
app.use(require("express-session")({
    secret: "Nixon is a cat",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/yelpcamp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());    //Tell app to use flash
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next) {
    //res.locals will make it available to every template:
    res.locals.currentUser = req.user;
    //make message available to every template
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    //Move onto the next middleware:
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
//Saying all campground routes should start with "/campgrounds":
app.use("/campgrounds", campgroundRoutes);



//Tell the server to listen for requests
//=====================================================================

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The server has started..");
});