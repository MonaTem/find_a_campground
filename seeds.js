var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");

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
                Campground.create(seed, function(err, campground) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Campground added...");
                        //Create a comment
                        Comment.create({text:"First comment for the campground", author: "Bob the Builder"}, function(err, comment) {
                            if(err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("New comment created..");
                            }
                        });
                    }
                });
            });
        }
    });
    
    
}

module.exports = seedDB;