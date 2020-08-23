import { Schema, model } from 'mongoose';

const ImageSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
});

export default model('Image', ImageSchema);
