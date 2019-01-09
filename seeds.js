let mongoose = require('mongoose');
let Campgrounds = require('./models/campgrounds');
let Comment = require('./models/comment');

let data = [
  {
    name: 'Clouds Hill',
    image:
      'https://www.quebecoriginal.com/en/listing/images/800x600/c3491525-6325-4ff1-b4fc-02333721c0cb/camping-fort-ramsay-sites-sur-le-bord-de-leau.jpg',
    description: 'Clouds. Lots of clouds.'
  },
  {
    name: 'Sunshine Meadow',
    image:
      'https://www.idahocampgroundreview.com/images/campgrounds/sunnygulch/sun_fac/sunnygulchgroup.JPG',
    description: 'Sunshine. Lots of sunshine.'
  },
  {
    name: 'Sunset Range',
    image: 'https://www.laketullochcampground.com/index_htm_files/3578@2x.jpg',
    description: 'Sunset. Beautiful sunset.'
  }
];

function seedDB() {
  //removed all campgrounds
  Campgrounds.remove({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('removed campgrounds');
      data.forEach(function(seed) {
        Campgrounds.create(seed, function(err, campground) {
          if (err) {
            console.log(err);
          } else {
            console.log('added campground');
            //create comments
            Comment.create(
              {
                text: 'ABC ABCABCABC ABCABC',
                author: 'GG'
              },
              function(err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log('created new comment');
                }
              }
            );
          }
        });
      });
    }
  });
}

module.exports = seedDB;
