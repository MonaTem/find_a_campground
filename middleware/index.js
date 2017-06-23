var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    //Is user logged in at all
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                res.redirect("back");
            } else {
                //Does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) {    //.equals is a mongoose method - have to use this b/c req.user._id is a string but foundCampground.author.id is a js object.
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        //If not, redirect
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
        //Is user logged in at all
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                res.redirect("back");
            } else {
                //Does the user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {    //.equals is a mongoose method - have to use this b/c req.user._id is a string but foundCampground.author.id is a js object.
                    next();
                } else {

                    res.redirect("back");
                }
            }
        });
    } else {
        //If not, redirect
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
     if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first!");    //This needs to be before the redirect code. It will show when the login page is rendered, not before it's rendered.
    res.redirect("/login");
};



module.exports = middlewareObj;