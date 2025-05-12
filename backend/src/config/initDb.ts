import connectDB from './db';
import User from '../models/User';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
  try {
    await connectDB();
    
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await User.create({
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created');
    }
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

// At the end of initDb.ts
export default initializeDatabase;