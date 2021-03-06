var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware");      //By calling the file index.js, we just need to require the parent directory.

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

router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    
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

router.get("/new", middleware.isLoggedIn, function(req, res) {
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

//EDIT route

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE route

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong..");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry, something went wrong...");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted!");
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;