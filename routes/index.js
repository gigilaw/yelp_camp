let express = require('express');
let router = express.Router();
let passport = require('passport');
let user = require('../models/user');
let campground = require('../models/campgrounds');

router.get('/', function(req, res) {
  res.render('landing');
});

//Auth Routes
//Show register form
router.get('/register', function(req, res) {
  res.render('register', { page: 'register' });
});
//Signup
router.post('/register', function(req, res) {
  let newUser = new user({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar
  });
  user.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register', { error: err.message });
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Successfully registered! Welcome to YelpCamp ' + req.body.username);
      res.redirect('/campgrounds');
    });
  });
});

//Login Routes

//Login form
router.get('/login', function(req, res) {
  res.render('login', { page: 'login' });
});
//login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  function(req, res) {}
);

//Logout logic
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/campgrounds');
});

//User profile
router.get('/users/:id', function(req, res) {
  user.findById(req.params.id, function(err, foundUser) {
    if (err) {
      req.flash('error', 'Cannot find user');
      res.redirect('back');
    }
    campground
      .find()
      .where('author.id')
      .equals(foundUser._id)
      .exec(function(err, campgrounds) {
        if (err) {
          req.flash('error', 'no campgrounds found');
          res.redirect('back');
        }
        res.render('users/show', { user: foundUser, campgrounds: campgrounds });
      });
  });
});

module.exports = router;
