let express = require('express');
let router = express.Router({ mergeParams: true });
let Campground = require('../models/campgrounds');
let Comment = require('../models/comment');

//COMMENTS ROUTE
router.get('/new', isLoggedIn, function(req, res) {
  //find campground id
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: foundCampground });
    }
  });
});

router.post('/', isLoggedIn, function(req, res) {
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
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          //redict to show page
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

//Comment edit
router.get('/:comment_id/edit', checkCommentOwner, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect('back');
    }
    res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
  });
});

//Comment Update
router.put('/:comment_id', checkCommentOwner, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect('back');
    }
    res.redirect('/campgrounds/' + req.params.id);
  });
});

//Comment Destroy
router.delete('/:comment_id', checkCommentOwner, function(req, res) {
  //find by ID and remove
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    }
    res.redirect('/campgrounds/' + req.params.id);
  });
});

function checkCommentOwner(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        }
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
