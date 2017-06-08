var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelpcamp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Campground Two",
//     image: "http://www.truckcampermagazine.com/wp-content/uploads/stories/Yellowstone-National-Park/Yellowstone-buffalo-11.jpg"
// }, function(err, newlyCreated) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("Campground added..");
//         console.log(newlyCreated);
//     }
// });


app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds:allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});







app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The server has started..");
});