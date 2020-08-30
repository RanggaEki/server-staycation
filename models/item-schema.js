const { Schema, model, ObjectId } = require('mongoose');

const ItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sumBooking: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    default: 'Indonesia',
  },
  city: {
    type: String,
    required: true,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    default: 'night',
  },
  categoryId: {
    type: ObjectId,
    ref: 'Category',
  },
  imageId: [{
    type: ObjectId,
    ref: 'Image',
  }],
  featureId: [{
    type: ObjectId,
    ref: 'Feature',
  }],
  activityId: [{
    type: ObjectId,
    ref: 'Activity',
  }],
});

module.exports = model('Item', ItemSchema);
