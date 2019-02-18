require('dotenv').config();

let express = require('express');
let app = express();
let bodyParser = require(`body-parser`);
let mongoose = require('mongoose');
let passport = require('passport');
let localStrategy = require('passport-local');
let methodOverride = require('method-override');
let flash = require('connect-flash');

let seedDB = require('./seeds');
let user = require('./models/user');
let commentRoutes = require('./routes/comments');
let campgroundRoutes = require('./routes/campgrounds');
let indexRoutes = require('./routes/index');
let reviewRoutes = require('./routes/reviews');

mongoose.connect(
  'mongodb+srv://gigilaw14:' +
    process.env.MONGOPWD +
    '@cluster0-wafee.mongodb.net/gigi-yelp-camp?retryWrites=true',
  function(err) {
    if (err) throw err;
  }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set(`view engine`, `ejs`);
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');
//seedDB();

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
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.listen(3000, () => {
  console.log('Server Started');
});

app.get('/map', function(req, res) {
  res.render('map');
});
