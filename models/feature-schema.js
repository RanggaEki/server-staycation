import { Schema, model } from 'mongoose';

const FeatureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

export default model('Feature', FeatureSchema);
