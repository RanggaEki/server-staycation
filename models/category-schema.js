const { Schema, model, ObjectId } = require('mongoose');

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

module.exports = model('Category', CategorySchema);
