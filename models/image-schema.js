const { Schema, model } = require('mongoose');

const ImageSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = model('Image', ImageSchema);
