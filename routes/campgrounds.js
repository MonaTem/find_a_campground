var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

//In the app.js file we defined that every campground route would start with "/campgrounds".  Now we don't need to specify /campgrounds in these routes, it can just be "/" because /campgrounds will be appended at the front:

//INDEX route - show all campgrounds
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});

//CREATE route - add a new campground to the db

router.post("/", function(req, res) {
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

router.get("/new", function(req, res) {
    res.render("campgrounds/new");
});

//SHOW route - show the information about a particular item.

router.get("/:id", function(req, res) {
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

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;