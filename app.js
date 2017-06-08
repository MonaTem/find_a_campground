var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


//Create a temp campgrounds array
var campgrounds = [
        {
            name: "Campground 1",
            image: "http://www.whcg.net/images/summer.jpg"
        },
        {
            name: "Campground 2",
            image: "http://www.truckcampermagazine.com/wp-content/uploads/stories/Yellowstone-National-Park/Yellowstone-buffalo-11.jpg"
        },
        {
            name: "Campground 3",
            image: "https://media-cdn.tripadvisor.com/media/photo-s/02/b4/bb/94/french-broad-river-campground.jpg"
        }
    ];

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});







app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The server has started..");
});