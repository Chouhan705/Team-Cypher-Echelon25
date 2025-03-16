import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const auth = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post('/token', formData);
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
};

// Job positions services
export const jobs = {
  getAll: async () => {
    const response = await api.get('/api/job-positions');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/job-positions/${id}`);
    return response.data;
  },
  create: async (jobData: any) => {
    const response = await api.post('/api/job-positions', jobData);
    return response.data;
  },
};

// Candidates services
export const candidates = {
  getAll: async (jobId?: number) => {
    const params = jobId ? { job_id: jobId } : {};
    const response = await api.get('/api/candidates', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/candidates/${id}`);
    return response.data;
  },
};

// Resume processing services
export const resumes = {
  parse: async (resumeText: string) => {
    const response = await api.post('/api/parse-resume', { resumeText });
    return response.data;
  },
  generateStandardProfile: async (position: string) => {
    const response = await api.post('/api/generate-standard-profile', { position });
    return response.data;
  },
  rank: async (resumeData: any, standardProfile: any) => {
    const response = await api.post('/api/rank-resume', { resumeData, standardProfile });
    return response.data;
  },
  upload: async (jobId: number, resumeText: string) => {
    const response = await api.post('/api/upload-resume', { jobId, resumeText });
    return response.data;
  },
};

export default api; 