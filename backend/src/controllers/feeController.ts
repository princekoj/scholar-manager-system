import { Request, Response } from 'express';
import FeeType from '../models/FeeType';
import Fee from '../models/Fee';
import Student from  "../models/Student"


export const createFeeType = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const feeType = await FeeType.create({ name, description });
    res.status(201).json(feeType);
  } catch (error) {
    console.error('Error creating fee type:', error);
    res.status(500).json({ error: 'Error creating fee type' });
  }
};


export const getAllFees = async (req: Request, res: Response) => {
  try {
    const fees = await Fee.find()
    
    res.json(fees);
  } catch (error) {
    console.error('Error getting all fees:', error);
    res.status(500).json({ error: 'Error getting all fees' });
  }
};

export const getFeeTypes = async (req: Request, res: Response) => {
  try {
    const feeTypes = await FeeType.find().sort({ createdAt: -1 });
    res.json(feeTypes);
  } catch (error) {
    console.error('Error getting fee types:', error);
    res.status(500).json({ error: 'Error getting fee types' });
  }
};

export const createFee = async (req: Request, res: Response) => {
  try {
    const { studentId, feeTypeId, amount, due_date } = req.body;
    
    const fee = await Fee.create({
  student: studentId,
  fee_type: feeTypeId, 
  amount,
  due_date: new Date(due_date)
    });
    
    res.status(201).json(fee);
  } catch (error) {
    console.error('Error creating fee:', error);
    res.status(500).json({ error: 'Error creating fee' });
  }
};

export const getStudentFees = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    
    const fees = await Fee.find({ student: studentId })
      .populate('feeType', 'name description')
      .sort({ due_date: 1 });
    
    res.json(fees);
  } catch (error) {
    console.error('Error getting student fees:', error);
    res.status(500).json({ error: 'Error getting student fees' });
  }
};


export const updateFeeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const fee = await Fee.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!fee) {
      return res.status(404).json({ error: 'Fee not found' });
    }
    
    res.json(fee);
  } catch (error) {
    console.error('Error updating fee status:', error);
    res.status(500).json({ error: 'Error updating fee status' });
  }
};