// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  sendOtp: (email: string) =>
    fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }),

  verifyRegister: (email: string, password: string, otp: string) =>
    fetch(`${API_BASE}/auth/verify-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, otp }),
    }),

  forgotPassword: (email: string) =>
    fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    }),

  // Applications
  getApplications: (token: string) =>
    fetch(`${API_BASE}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createApplication: (token: string, data: any) =>
    fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),

  updateStatus: (token: string, id: number, status: string) =>
    fetch(`${API_BASE}/applications/${id}?status=${status}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateNotes: (token: string, id: number, notes: string) =>
    fetch(`${API_BASE}/applications/${id}/notes`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
    }),

  deleteApplication: (token: string, id: number) =>
    fetch(`${API_BASE}/applications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Match analysis
  analyzeMatch: (token: string, resumeFile: File, jobDescription: string) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);
    return fetch(`${API_BASE}/match/analyze`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  },

  // AI suggestions
  getAISuggestions: (token: string, resumeFile: File, jobDescription: string) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);
    return fetch(`${API_BASE}/ai/suggestions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  },

  askAIAdvice: (token: string, prompt: string) =>
    fetch(`${API_BASE}/ai/advice`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    }),
};