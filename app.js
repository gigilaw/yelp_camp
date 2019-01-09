let express = require('express');
let app = express();
let bodyParser = require(`body-parser`);
let mongoose = require('mongoose');
let Campground = require('./models/campgrounds');
let seedDB = require('./seeds');

seedDB();
mongoose.connect(
  'mongodb://localhost/yelp_camp',
  { useNewUrlParser: true }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set(`view engine`, `ejs`);

// //Create Campground
// Campground.create({
//   name: 'Salmon Creek',
//   image: 'http://www.suttonfalls.com/communities/4/004/012/498/244//images/4628314067_550x441.jpg',
//   description: 'Salmon. Lots of salmon'
// });

app.get('/', function(req, res) {
  res.render('landing');
});
app.get(`/campgrounds`, function(req, res) {
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render(`index`, { campgrounds: allCampgrounds });
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
  res.render(`new`);
});

app.get('/campgrounds/:id', function(req, res) {
  //find campground with said ID
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      //render template with said ID
      res.render('show', { campground: foundCampground });
    }
  });
});

app.listen(3000, () => {
  console.log('Server Started');
});
