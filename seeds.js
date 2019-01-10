let mongoose = require('mongoose');
let Campgrounds = require('./models/campgrounds');
let Comment = require('./models/comment');

let data = [
  {
    name: 'Clouds Hill',
    image:
      'https://www.quebecoriginal.com/en/listing/images/800x600/c3491525-6325-4ff1-b4fc-02333721c0cb/camping-fort-ramsay-sites-sur-le-bord-de-leau.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis vestibulum dui, ac dapibus dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce sed arcu vehicula, elementum augue et, placerat nulla. Fusce convallis orci consequat nisi hendrerit rutrum. Sed laoreet velit ac massa posuere porttitor. Nunc laoreet tempor lorem, sed aliquam eros venenatis at. Cras mauris augue, gravida non pulvinar ac, ullamcorper quis odio. Maecenas malesuada elit nisl, id elementum urna varius sed. Nulla fringilla nisi eu vulputate tristique. Aliquam bibendum neque sit amet euismod semper. Vivamus nec nisi placerat, sollicitudin metus posuere, dapibus metus. Ut vitae mi a nunc hendrerit imperdiet quis nec arcu. Vivamus eu gravida dolor, nec imperdiet enim. Quisque bibendum, ipsum at efficitur pellentesque, purus mi pellentesque felis, id tristique nunc nisl quis nisi.'
  },
  {
    name: 'Sunshine Meadow',
    image:
      'https://www.idahocampgroundreview.com/images/campgrounds/sunnygulch/sun_fac/sunnygulchgroup.JPG',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis vestibulum dui, ac dapibus dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce sed arcu vehicula, elementum augue et, placerat nulla. Fusce convallis orci consequat nisi hendrerit rutrum. Sed laoreet velit ac massa posuere porttitor. Nunc laoreet tempor lorem, sed aliquam eros venenatis at. Cras mauris augue, gravida non pulvinar ac, ullamcorper quis odio. Maecenas malesuada elit nisl, id elementum urna varius sed. Nulla fringilla nisi eu vulputate tristique. Aliquam bibendum neque sit amet euismod semper. Vivamus nec nisi placerat, sollicitudin metus posuere, dapibus metus. Ut vitae mi a nunc hendrerit imperdiet quis nec arcu. Vivamus eu gravida dolor, nec imperdiet enim. Quisque bibendum, ipsum at efficitur pellentesque, purus mi pellentesque felis, id tristique nunc nisl quis nisi.'
  },
  {
    name: 'Sunset Range',
    image: 'https://www.laketullochcampground.com/index_htm_files/3578@2x.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis vestibulum dui, ac dapibus dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce sed arcu vehicula, elementum augue et, placerat nulla. Fusce convallis orci consequat nisi hendrerit rutrum. Sed laoreet velit ac massa posuere porttitor. Nunc laoreet tempor lorem, sed aliquam eros venenatis at. Cras mauris augue, gravida non pulvinar ac, ullamcorper quis odio. Maecenas malesuada elit nisl, id elementum urna varius sed. Nulla fringilla nisi eu vulputate tristique. Aliquam bibendum neque sit amet euismod semper. Vivamus nec nisi placerat, sollicitudin metus posuere, dapibus metus. Ut vitae mi a nunc hendrerit imperdiet quis nec arcu. Vivamus eu gravida dolor, nec imperdiet enim. Quisque bibendum, ipsum at efficitur pellentesque, purus mi pellentesque felis, id tristique nunc nisl quis nisi.'
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
