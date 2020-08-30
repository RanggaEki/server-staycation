import { Schema, model, ObjectId } from 'mongoose';

const FeatureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  itemId: {
    type: ObjectId,
    ref: 'Item',
  },
});

export default model('Feature', FeatureSchema);
