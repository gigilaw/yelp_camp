let express = require('express');
let router = express.Router();
let Campground = require('../models/campgrounds');
let middleware = require('../middleware');
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

router.get(`/`, function(req, res) {
  let noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({ name: regex }, function(err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        if (allCampgrounds.length < 1) {
          noMatch = 'No campgrounds match that query, please try again.';
        }
        res.render('campgrounds/index', { campgrounds: allCampgrounds, noMatch: noMatch });
      }
    });
  } else {
    Campground.find({}, function(err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render(`campgrounds/index`, {
          campgrounds: allCampgrounds,
          currentUser: req.user,
          page: 'campgrounds',
          noMatch: noMatch
        });
      }
    });
  }
});

router.post(`/`, middleware.isLoggedIn, function(req, res) {
  let name = req.body.name;
  let img = req.body.img;
  let price = req.body.price;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    let newCampground = {
      name: name,
      price: price,
      image: img,
      description: description,
      author: author,
      location: location,
      lat: lat,
      lng: lng
    };
    //create new campground and save to DB;
    Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`campgrounds`);
      }
    });
  });
});

router.get(`/new`, middleware.isLoggedIn, function(req, res) {
  res.render(`campgrounds/new`);
});

//Show more info
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

//Edit route
router.get('/:id/edit', middleware.checkCampgroundOwner, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});
//Update route
router.put('/:id', middleware.checkCampgroundOwner, function(req, res) {
  //find and update correct campground
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findOneAndUpdate(req.params.id, req.body.campground, function(
      err,
      updatedCampground
    ) {
      if (err) {
        req.flash('error', err.message);
        res.redirect('back');
      }
      req.flash('success', 'Successfully Updated!');
      res.redirect('/campgrounds/' + req.params.id);
    });
    //redirect
  });
});

//Delete Route
router.delete('/:id', middleware.checkCampgroundOwner, function(req, res) {
  Campground.findOneAndDelete(req.params.id, function(err) {
    if (err) {
      res.redirect('/campgrounds');
    }
    res.redirect('/campgrounds');
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
module.exports = router;
