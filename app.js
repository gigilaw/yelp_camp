let express = require('express');
let app = express();
let bodyParser = require(`body-parser`);
let campgrounds = [
  {
    name: `Salmon Creek`,
    image: `http://www.suttonfalls.com/communities/4/004/012/498/244//images/4628314067_550x441.jpg`
  },
  {
    name: `Granite Hill`,
    image: `https://4.bp.blogspot.com/-juu6Bp3IIkg/VAiFAquwotI/AAAAAAAAaOo/xvh3tQmCTtMTN7muYen7W5EwfmSvTgoegCKgB/s640/IMGP9575.JPG`
  },
  {
    name: `Mountain Goat's Rest`,
    image: `https://www.nps.gov/crmo/planyourvisit/images/moon-over-group-campground.JPG?maxwidth=650&autorotate=false`
  }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.set(`view engine`, `ejs`);

app.get('/', function(req, res) {
  res.render('landing');
});

app.get(`/campgrounds`, function(req, res) {
  res.render(`campgrounds`, { campgrounds: campgrounds });
});

app.post(`/campgrounds`, function(req, res) {
  let name = req.body.name;
  let img = req.body.img;
  let newCampground = { name: name, image: img };
  campgrounds.push(newCampground);
  res.redirect(`campgrounds`);
  console.log(img);
});

app.get(`/campgrounds/new`, function(req, res) {
  res.render(`new`);
});

app.listen(3000, () => {
  console.log('Server Started');
});
