var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");

//Call the seedDB function
seedDB();

mongoose.connect("mongodb://localhost/yelpcamp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


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
            res.render("index", {campgrounds:allCampgrounds});
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
    res.render("new");
});

//SHOW route - show the information about a particular item.

app.get("/campgrounds/:id", function(req, res) {
    //Find the campground with the provided ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            //Render the show template with the info from that campground
            res.render("show", {campground: foundCampground});
        }
    });
});





app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The server has started..");
});