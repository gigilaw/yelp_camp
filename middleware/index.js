//All middleware
let Campground = require('../models/campgrounds');
let Comment = require('../models/comment');
let middlewareObj = {};

middlewareObj.checkCampgroundOwner = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        //does user own campground
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please login first');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwner = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        }
        req.flash('error', 'You do not have permission to do that');
        res.redirect('back');
      }
    });
  } else {
    req.flash('error', 'Please login');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please login');
  res.redirect('/login');
};

module.exports = middlewareObj;
