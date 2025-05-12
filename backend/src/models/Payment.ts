import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  fee: { type:String, required: true },
  amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  reference_number: String
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);