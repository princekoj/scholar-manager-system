import mongoose from 'mongoose';

const FeeSchema = new mongoose.Schema({
  student: { type: String, ref: 'Student', required: true },
  fee_type: { type: String, required: true },
  amount: { type: Number, required: true },
  due_date: { type: Date, required: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Fee', FeeSchema);