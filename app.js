let express = require('express');
let app = express();
let bodyParser = require(`body-parser`);
let mongoose = require('mongoose');
let Campground = require('./models/campgrounds');
let seedDB = require('./seeds');
let Comment = require('./models/comment');
let passport = require('passport');
let localStrategy = require('passport-local');
let user = require('./models/user');

mongoose.connect(
  'mongodb://localhost/yelp_camp',
  { useNewUrlParser: true }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set(`view engine`, `ejs`);
app.use(express.static(__dirname + '/public'));
seedDB();

//Passport config
app.use(
  require('express-session')({
    secret: 'lalalalalala',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get('/', function(req, res) {
  res.render('landing');
});
app.get(`/campgrounds`, function(req, res) {
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render(`campgrounds/index`, { campgrounds: allCampgrounds });
    }
  });
});

app.post(`/campgrounds`, function(req, res) {
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

app.get(`/campgrounds/new`, function(req, res) {
  res.render(`campgrounds/new`);
});

app.get('/campgrounds/:id', function(req, res) {
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

//COMMENTS ROUTE
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
  //find campground id
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: foundCampground });
    }
  });
});

app.post('/campgrounds/:id/comments', function(req, res) {
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

//Auth Routes
//Show register form
app.get('/register', function(req, res) {
  res.render('register');
});
//Signup
app.post('/register', function(req, res) {
  let newUser = new user({ username: req.body.username });
  user.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/campgrounds');
    });
  });
});

//Login Routes
//Login form
app.get('/login', function(req, res) {
  res.render('login');
});
//login logic
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  function(req, res) {}
);

//Logout logic
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
app.listen(3000, () => {
  console.log('Server Started');
});
