import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  grade: String,
  date_of_birth: Date,
  gender: String
}, { timestamps: true });

export default mongoose.model('Student', StudentSchema);