var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");

var data = [
        {
            name: "Grassy Plains Campground",
            image: "https://www.nps.gov/shen/planyourvisit/images/Campgrounds_1.jpg",
            description: "Marvels mighty mutants go worldwide and beyond in this series following Cyclops, Wolverine, Beast, Emma Frost and more in their astonishing adventures. Amazing Spider-Man is the cornerstone of the Marvel Universe. Born with super-human senses and the power to heal from almost any wound, Wolverine was captured by a secret Canadian organization and given an unbreakable skeleton and claws. Now, hes a premiere member of both the X-Men and the Avengers."
        },
        {
            name: "Snowy Peak",
            image: "http://www.visitcentraliowa.com/images/campground.jpg",
            description: "Marvels mighty mutants go worldwide and beyond in this series following Cyclops, Wolverine, Beast, Emma Frost and more in their astonishing adventures. Amazing Spider-Man is the cornerstone of the Marvel Universe. Born with super-human senses and the power to heal from almost any wound, Wolverine was captured by a secret Canadian organization and given an unbreakable skeleton and claws. Now, hes a premiere member of both the X-Men and the Avengers."
        },
        {
            name: "Desert Mesa",
            image: "http://camprrm.com/wp-content/uploads/2012/02/widewaters-campground-1.jpg",
            description: "Marvels mighty mutants go worldwide and beyond in this series following Cyclops, Wolverine, Beast, Emma Frost and more in their astonishing adventures. Amazing Spider-Man is the cornerstone of the Marvel Universe. Born with super-human senses and the power to heal from almost any wound, Wolverine was captured by a secret Canadian organization and given an unbreakable skeleton and claws. Now, hes a premiere member of both the X-Men and the Avengers."
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