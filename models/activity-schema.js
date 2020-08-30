import { Schema, model, ObjectId } from 'mongoose';

const ActivitySchema = new Schema({
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
  isPopular: {
    type: Boolean,
    default: false,
  },
  itemId: {
    type: ObjectId,
    ref: 'Item',
  },
});

export default model('Activity', ActivitySchema);
