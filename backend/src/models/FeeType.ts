import mongoose from 'mongoose';

const FeeTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String
}, { timestamps: true });

export default mongoose.model('FeeType', FeeTypeSchema);