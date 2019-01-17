let express = require('express');
let router = express.Router();
let Campground = require('../models/campgrounds');
let Comment = require('../models/comment');

//COMMENTS ROUTE
router.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
  //find campground id
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: foundCampground });
    }
  });
});

router.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
  //look up campground
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      //create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          //associate campground with comment
          campground.comments.push(comment);
          campground.save();
          //redict to show page
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
