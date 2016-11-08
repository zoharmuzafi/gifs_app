var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GifSchema = new Schema({
  url: String
});

var Gif = mongoose.model('Gif', GifSchema);
module.exports = Gif;
