import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

// MongoDB connection setup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';

// Define Mongoose schemas
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const parentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  createdAt: { type: Date, default: Date.now }
});

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
  fee: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee', required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now }
});

// Create models
const Student = mongoose.model('Student', studentSchema);
const Parent = mongoose.model('Parent', parentSchema);
const Fee = mongoose.model('Fee', feeSchema);
const Payment = mongoose.model('Payment', paymentSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // MongoDB automatically creates collections when first used, 
    // so we don't need explicit CREATE TABLE statements

    // Create sample student
    const sampleStudent = await Student.create({
      name: 'John Doe',
      email: 'john.doe@example.com'
    });

    return res.status(200).json({ 
      status: 'connected', 
      message: 'Database connection successful and sample student added',
      studentId: sampleStudent._id
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to connect to the database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    // Close the connection
    await mongoose.disconnect();
  }
}