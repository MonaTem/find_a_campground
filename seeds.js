var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");

var data = [
        {
            name: "First campground",
            image: "https://www.nps.gov/shen/planyourvisit/images/Campgrounds_1.jpg",
            description: "A campground with a bbq and benches."
        },
        {
            name: "Second campground",
            image: "http://www.visitcentraliowa.com/images/campground.jpg",
            description: "Lots and lots of campervans."
        },
        {
            name: "Third campground",
            image: "http://camprrm.com/wp-content/uploads/2012/02/widewaters-campground-1.jpg",
            description: "Just a lake...."
        }
    ];

function seedDB() {
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Removed campgrounds");
            //Add a few campgrounds
            data.forEach(function(seed) {
                Campground.create(seed, function(err, data) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Campground added...");
                    }
                });
            });
        }
    });
    
    
}

module.exports = seedDB;