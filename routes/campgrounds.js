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

router.post(`/`, function(req, res) {
  let name = req.body.name;
  let img = req.body.img;
  let des = req.body.description;
  let newCampground = { name: name, image: img, description: des };
  //create new campground and save to DB;
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(`campgrounds`);
    }
  });
});

router.get(`/new`, function(req, res) {
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

module.exports = router;
