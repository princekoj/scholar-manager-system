import express from 'express';
import { auth, adminAuth } from '../middleware/auth';
import {
  createPayment,
  getStudentPayments,
  getFeePayments,
  getPaymentStats
} from '../controllers/paymentController';
import asyncHandler from '../utils/asyncHandler';

const router = express.Router();

// router.use(auth);

router.post('/', asyncHandler(createPayment));
router.get('/student/:student_id', asyncHandler(getStudentPayments));
router.get('/fee/:fee_id', asyncHandler(getFeePayments));
router.get('/stats', asyncHandler(getPaymentStats));

export default router;