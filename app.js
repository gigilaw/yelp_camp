let express = require('express');
let app = express();

app.set(`view engine`, `ejs`);

app.get('/', function(req, res) {
  res.render('landing');
});

app.get(`/campgrounds`, function(req, res) {
  let campgrounds = [
    {
      name: `Salmon Creek`,
      img: `https://www.nps.gov/shen/planyourvisit/images/20170712_A7A9022_nl_Campsites_BMCG_960.jpg?maxwidth=1200&maxheight=1200&autorotate=false`
    },
    {
      name: `Granite Hill`,
      img: `http://haulihuvila.com/wp-content/uploads/2012/08/hauli-huvila-campgrounds-header.jpg`
    },
    {
      name: `Mountain Goat's Rest`,
      img: `https://www.planetware.com/photos-large/USUT/utah-zion-national-park-camping-south-campground.jpg`
    }
  ];
  res.render(`campgrounds`, { campgrounds: campgrounds });
});

app.listen(3000, () => {
  console.log('Server Started');
});
