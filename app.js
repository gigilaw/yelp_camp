let express = require('express');
let app = express();
let bodyParser = require(`body-parser`);
let mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost/yelp_camp',
  { useNewUrlParser: true }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set(`view engine`, `ejs`);

//Schema Setup
let campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

let Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', function(req, res) {
  res.render('landing');
});
app.get(`/campgrounds`, function(req, res) {
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render(`campgrounds`, { campgrounds: allCampgrounds });
    }
  });
});

app.post(`/campgrounds`, function(req, res) {
  let name = req.body.name;
  let img = req.body.img;
  let newCampground = { name: name, image: img };
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

app.listen(3000, () => {
  console.log('Server Started');
});
