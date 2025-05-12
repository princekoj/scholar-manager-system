import express from 'express';
// import { auth, adminAuth } from '../middleware/auth'; // 👈 Temporarily disable
import {
  createFeeType,
  getFeeTypes,
  createFee,
  getStudentFees,
  updateFeeStatus,
  getAllFees
} from '../controllers/feeController';

const router = express.Router();

// REMOVE OR COMMENT OUT THIS LINE
// router.use(auth); // 👈 Remove global auth middleware for now

// Fee Types routes
// router.post('/types', adminAuth, createFeeType); // 👈 Disable auth
router.post('/types', createFeeType); // 👈 Unprotected
router.get('/types', getFeeTypes);

// Fees routes
// router.post('/', adminAuth, createFee); // 👈 Disable auth
router.post('/', createFee); // 👈 Unprotected
router.get('/',getAllFees)
router.get('/student/:student_id', getStudentFees);
// router.patch('/:id/status', adminAuth, updateFeeStatus); // 👈 Disable auth
router.patch('/:id/status', updateFeeStatus); // 👈 Unprotected

export default router;
