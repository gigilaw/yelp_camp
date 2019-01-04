let express = require('express');
let app = express();
let bodyParser = require(`body-parser`);
let campgrounds = [
  {
    name: `Salmon Creek`,
    image: `https://www.nps.gov/shen/planyourvisit/images/20170712_A7A9022_nl_Campsites_BMCG_960.jpg?maxwidth=1200&maxheight=1200&autorotate=false`
  },
  {
    name: `Granite Hill`,
    image: `http://haulihuvila.com/wp-content/uploads/2012/08/hauli-huvila-campgrounds-header.jpg`
  },
  {
    name: `Mountain Goat's Rest`,
    image: `https://www.planetware.com/photos-large/USUT/utah-zion-national-park-camping-south-campground.jpg`
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
