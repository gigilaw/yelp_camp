let mongoose = require('mongoose');
let commentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

let comment = mongoose.model('Comment', commentSchema);
module.exports = comment;
