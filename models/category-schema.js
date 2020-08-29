import { Schema, model, ObjectId } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  itemId: [{
    type: ObjectId,
    ref: 'Item',
  }],
});

// module.exports = model('Category', CategorySchema);
export default model('Category', CategorySchema);
