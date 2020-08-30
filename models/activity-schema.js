const { Schema, model, ObjectId } = require('mongoose');

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

module.exports = model('Activity', ActivitySchema);
