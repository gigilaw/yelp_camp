let express = require('express');
let router = express.Router();
let Campground = require('../models/campgrounds');

router.get(`/`, function(req, res) {
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render(`campgrounds/index`, { campgrounds: allCampgrounds, currentUser: req.user });
    }
  });
});

router.post(`/`, isLoggedIn, function(req, res) {
  let name = req.body.name;
  let img = req.body.img;
  let des = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newCampground = { name: name, image: img, description: des, author: author };
  //create new campground and save to DB;
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(`campgrounds`);
    }
  });
});

router.get(`/new`, isLoggedIn, function(req, res) {
  res.render(`campgrounds/new`);
});

router.get('/:id', function(req, res) {
  //find campground with said ID
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        //render template with said ID
        res.render('campgrounds/show', { campground: foundCampground });
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
