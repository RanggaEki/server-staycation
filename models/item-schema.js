import { Schema, model, ObjectId } from 'mongoose';

const ItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
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

export default model('Item', ItemSchema);
