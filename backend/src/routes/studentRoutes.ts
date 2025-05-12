import express from 'express';
import {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudents,
  getStudentById,
} from '../controllers/studentController';
import { adminAuth } from '../middleware/auth';
import asyncHandler from '../utils/asyncHandler';

const router = express.Router();

router.post('/', adminAuth, asyncHandler(createStudent));
router.put('/:id', adminAuth, asyncHandler(updateStudent));
router.delete('/:id', adminAuth, asyncHandler(deleteStudent));
router.get('/', asyncHandler(getStudents));
router.get('/:id', asyncHandler(getStudentById));

export default router;