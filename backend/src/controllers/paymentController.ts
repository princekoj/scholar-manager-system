import { Request, Response } from 'express';
import Payment from '../models/Payment';
import Fee from '../models/Fee';
import mongoose from 'mongoose';

export const createPayment = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { feeId, amount, payment_method, reference_number } = req.body;

    // Basic validation
    if (!feeId || typeof feeId !== 'string') {
      return res.status(400).json({ error: 'Valid fee ID is required' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (!payment_method) {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    // Create payment
    const payment = await Payment.create([{
      fee: feeId,
      amount,
      payment_method,
      reference_number
    }], { session });

    // Optional: Update fee status if fee exists
    try {
      const fee = await Fee.findById(feeId).session(session);
      if (fee) {
        const totalPaid = await Payment.aggregate([
          { $match: { fee: feeId } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).session(session);

        const paidAmount = totalPaid[0]?.total || 0;
        
        if (paidAmount >= fee.amount) {
          fee.status = 'paid';
        } else if (paidAmount > 0) {
          fee.status = 'partial';
        }
        
        await fee.save({ session });
      }
    } catch (feeError) {
      console.log('Fee status not updated', feeError);
      // Continue even if fee update fails
    }

    await session.commitTransaction();
    res.status(201).json(payment[0]);
    
  } catch (error) {
    await session.abortTransaction();
    console.error('Payment error:', error);
    res.status(500).json({ 
      error: 'Payment processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    session.endSession();
  }
};

export const getStudentPayments = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    
    const payments = await Payment.find({})
      .populate({
        path: 'fee',
        match: { student: studentId },
        populate: {
          path: 'feeType',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    
    // Filter out payments not related to the student
    const filteredPayments = payments.filter(p => p.fee !== null);
    
    res.json(filteredPayments);
  } catch (error) {
    console.error('Error getting student payments:', error);
    res.status(500).json({ error: 'Error getting student payments' });
  }
};

export const getFeePayments = async (req: Request, res: Response) => {
  try {
    const { feeId } = req.params;
    const payments = await Payment.find({ fee: feeId })
      .sort({ createdAt: -1 });
    
    res.json(payments);
  } catch (error) {
    console.error('Error getting fee payments:', error);
    res.status(500).json({ error: 'Error getting fee payments' });
  }
};

export const getPaymentStats = async (req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const stats = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total_payments: { $sum: 1 },
          total_amount: { $sum: '$amount' },
          average_amount: { $avg: '$amount' },
          unique_fees: { $addToSet: '$fee' }
        }
      },
      {
        $project: {
          _id: 0,
          total_payments: 1,
          total_amount: 1,
          average_amount: 1,
          unique_fees: { $size: '$unique_fees' }
        }
      }
    ]);
    
    res.json(stats[0] || {
      total_payments: 0,
      total_amount: 0,
      average_amount: 0,
      unique_fees: 0
    });
  } catch (error) {
    console.error('Error getting payment stats:', error);
    res.status(500).json({ error: 'Error getting payment stats' });
  }
};