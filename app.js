var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");
var User = require("./models/user");
var seedDB = require("./seeds");

//Call the seedDB function
seedDB();

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
app.use(express.static(__dirname + "/public"));


//ROUTES
//========================================================================================
app.get("/", function(req, res) {
    res.render("landing");
});


//INDEX route - show all campgrounds
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

//CREATE route - add a new campground to the db

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW route - shows the form to add a new campground

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

//SHOW route - show the information about a particular item.

app.get("/campgrounds/:id", function(req, res) {
    //Find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            //Render the show template with the info from that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//COMMENTS ROUTES
//=====================================================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save(function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                            res.redirect("/campgrounds/" + campground._id);
                        }
                    });
                }
            });
        }
    });
});


//AUTH ROUTES
//=====================================================================

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//Tell the server to listen for requests
//=====================================================================

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The server has started..");
});