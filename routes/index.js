let express = require('express');
let router = express.Router();
let passport = require('passport');
let user = require('../models/user');
let campground = require('../models/campgrounds');
let async = require('async');
let nodemailer = require('nodemailer');
let crypto = require('crypto');

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
    userDescription: req.body.userDescription
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
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password.'
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

//password reset
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          let token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        user.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with the matching email address exists.');
            return res.redirect('back');
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 1800000;

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        let smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'yelp.camp.pwdreset@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        let mailOptions = {
          to: user.email,
          from: 'yelp.camp.pwdreset@gmail.com',
          subject: 'Yelp Camp Password Reset',
          text:
            'You are receiving this email because you (or someone else) have requested the reset of your password.\n\n' +
            'Please click the following link or paste it into your browser to complete the process:\n\n' +
            'http://' +
            req.headers.host +
            '/reset/' +
            token +
            '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n\n' +
            'Yelp Camp'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'A password reset email has been sent to ' + user.email + '.');
          done(err, 'done');
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    }
  );
});

router.get('/reset/:token', function(req, res) {
  user.findOne(
    { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },
    function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', { token: req.params.token });
    }
  );
});

router.post('/reset/:token', function(req, res) {
  async.waterfall(
    [
      function(done) {
        user.findOne(
          { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },
          function(err, user) {
            if (!user) {
              req.flash('error', 'Password reset token is invalid or has expired.');
              return res.redirect('back');
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function(err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                  req.logIn(user, function(err) {
                    done(err, user);
                  });
                });
              });
            } else {
              req.flash('error', 'Passwords do not match');
              return res.redirect('back');
            }
          }
        );
      },
      function(user, done) {
        let smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'yelp.camp.pwdreset@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        let mailOptions = {
          to: user.email,
          from: 'yelp.camp.pwdreset@gmail.com',
          subject: 'Your password has been changed',
          text:
            'Hello, \n\n' +
            'This is to confirm that your password for ' +
            user.email +
            ' has successfully been changed. \n\n' +
            'Yelp Camp'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ],
    function(err) {
      res.redirect('/campgrounds');
    }
  );
});
module.exports = router;
