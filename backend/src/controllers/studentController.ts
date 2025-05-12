import Student from '../models/Student';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Create Student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const studentData = req.body;

    if (!studentData.student_id || !studentData.first_name || !studentData.last_name) {
      return res.status(400).json({ error: 'Student ID, first name, and last name are required' });
    }

    studentData.email = studentData.email || `${studentData.student_id.toLowerCase()}@example.com`;

    const student = await Student.create(studentData);
    res.status(201).json(student);
  } catch (error: any) {
    if (error.code === 11000) {
      const key = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${key} already exists` });
    }
    console.error('Error creating student:', error);
    res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get All Students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { student_id: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const students = await Student.find(query).sort({ last_name: 1, first_name: 1 });
    res.json(students);
  } catch (error) {
    console.error('Error getting students:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Student by ID
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Student ID is required' });

    if (mongoose.Types.ObjectId.isValid(id)) {
      const studentById = await Student.findById(id);
      if (studentById) return res.json(formatStudentResponse(studentById));
    }

    const studentByStudentId = await Student.findOne({ student_id: id });
    if (studentByStudentId) return res.json(formatStudentResponse(studentByStudentId));

    const localStorageId = req.headers['x-student-id'] || req.cookies?.studentId;
    if (localStorageId) {
      const studentByLocalStorageId = await Student.findOne({
        $or: [
          { _id: localStorageId },
          { student_id: localStorageId },
        ],
      });
      if (studentByLocalStorageId) return res.json(formatStudentResponse(studentByLocalStorageId));
    }

    return res.status(404).json({ error: 'Student not found' });
  } catch (error) {
    console.error('Error getting student:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Format student response
const formatStudentResponse = (student: any) => ({
  _id: student._id,
  student_id: student.student_id,
  first_name: student.first_name,
  last_name: student.last_name,
  email: student.email,
  phone: student.phone,
  address: student.address,
  grade: student.grade,
  date_of_birth: student.date_of_birth,
  gender: student.gender,
  createdAt: student.createdAt,
  updatedAt: student.updatedAt,
});

// Update Student
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error: any) {
    if (error.code === 11000) {
      const key = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${key} already exists` });
    }
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Student
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
