import { Schema, model, ObjectId } from 'mongoose';

const BookingSchema = new Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  itemId: [{
    _id: {
      type: ObjectId,
      ref: 'Item',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    night: {
      type: Number,
      required: true,
    },
  }],
  memberId: [{
    type: ObjectId,
    ref: 'Member',
  }],
  bankId: [{
    type: ObjectId,
    ref: 'Bank',
  }],
  proofPayment: {
    type: String,
    required: true,
  },
  bankFrom: {
    type: String,
    required: true,
  },
  accountHolder: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

export default model('Booking', BookingSchema);
