import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name:string,email: string, password: string, role: string) => {
    const response = await api.post('/auth/register', {name, email, password, role });
    return response.data;
  },
};

// Students API calls
export const studentsAPI = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  create: async (studentData: any) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },
  update: async (id: string, studentData: any) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

// Fees API calls
export const feesAPI = {
  getAll: async () => {
    const response = await api.get('/fees');
    return response.data;
  },
  getByStudentId: async (studentId: string) => {
    const response = await api.get(`/fees/student/${studentId}`);
    return response.data;
  },
  create: async (feeData: any) => {
    const response = await api.post('/fees', feeData);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/fees/${id}/status`, { status });
    return response.data;
  },
};

// Payments API calls
export const paymentsAPI = {
  create: async (paymentData: any) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
  getByStudentId: async (studentId: string) => {
    const response = await api.get(`/payments/student/${studentId}`);
    return response.data;
  },
  getByFeeId: async (feeId: string) => {
    const response = await api.get(`/payments/fee/${feeId}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  },
};

export default api; 