let express = require('express');
let app = express();
let bodyParser = require(`body-parser`);
let mongoose = require('mongoose');
let seedDB = require('./seeds');
let passport = require('passport');
let localStrategy = require('passport-local');
let user = require('./models/user');

let commentRoutes = require('./routes/comments');
let campgroundRoutes = require('./routes/campgrounds');
let indexRoutes = require('./routes/index');

mongoose.connect(
  'mongodb://localhost/yelp_camp',
  { useNewUrlParser: true }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set(`view engine`, `ejs`);
app.use(express.static(__dirname + '/public'));
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
  next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, () => {
  console.log('Server Started');
});
