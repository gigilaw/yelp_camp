let mongoose = require('mongoose');
let commentSchema = mongoose.Schema({
  text: String,
  author: String
});

let comment = mongoose.model('Comment', commentSchema);
module.exports = comment;
