import express from 'express';
import { register, login } from '../controllers/authController';
import asyncHandler from '../utils/asyncHandler';


const router = express.Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

export default router; 