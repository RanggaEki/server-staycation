import { Schema, model } from 'mongoose';

const BankSchema = new Schema({
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

export default model('Bank', BankSchema);
