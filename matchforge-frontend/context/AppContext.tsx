'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// ========== Types ==========
type AnalysisResult = {
  score: number;
  breakdown: Record<string, number>;
  role: string;
  company: string;
  matchedSkills: string[];
  missingSkills: { critical: string[]; niceToHave: string[]; bonus: string[] };
  suggestions: { id: string; title: string; description: string; priority: string }[];
};

type Application = {
  id: number;
  company: string;
  role: string;
  score: number;
  status: string;
  appliedDate: string;
  notes?: string;
};

type AppContextType = {
  resumeFile: File | null;
  jobDescription: string;
  analysisResult: AnalysisResult | null;
  setResumeFile: (file: File | null) => void;
  setJobDescription: (jd: string) => void;
  runAnalysis: (jd?: string) => Promise<void>;
  token: string | null;
  loading: boolean;
  applications: Application[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  saveApplication: (company: string, role: string, score: number, status: string, appliedDate?: string, notes?: string) => Promise<void>;
  updateApplicationStatus: (id: number, status: string) => Promise<void>;
  updateApplicationNotes: (id: number, notes: string) => Promise<void>;
  deleteApplication: (id: number) => Promise<void>;
};

// ========== Environment variable for backend URL ==========
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ========== Cookie helpers ==========
function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// ========== Context ==========
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = getCookie('token');
      if (storedToken) {
        setToken(storedToken);
        await fetchApplications(storedToken);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const fetchApplications = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const apps = await res.json();
        setApplications(apps);
      }
    } catch (err) {
      console.error('Failed to fetch applications', err);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      setCookie('token', data.token);
      await fetchApplications(data.token);
    } else {
      throw new Error('Invalid response');
    }
  };

  const register = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Registration failed');
  };

  const logout = () => {
    setToken(null);
    setApplications([]);
    removeCookie('token');
  };

  const saveApplication = async (company: string, role: string, score: number, status: string, appliedDate?: string, notes?: string) => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company,
        role,
        score,
        status,
        appliedDate: appliedDate || new Date().toISOString(),
        notes: notes || '',
      }),
    });
    if (!res.ok) throw new Error('Failed to save application');
    const newApp = await res.json();
    setApplications((prev) => [...prev, newApp]);
  };

  const updateApplicationStatus = async (id: number, status: string) => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${API_BASE}/applications/${id}?status=${status}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to update status');
    const updated = await res.json();
    setApplications((prev) => prev.map((app) => (app.id === id ? updated : app)));
  };

  const updateApplicationNotes = async (id: number, notes: string) => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${API_BASE}/applications/${id}/notes`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error('Failed to update notes');
    const updated = await res.json();
    setApplications((prev) => prev.map((app) => (app.id === id ? updated : app)));
  };

  const deleteApplication = async (id: number) => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete application');
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const runAnalysis = async (directJobDescription?: string) => {
    if (directJobDescription) {
      setJobDescription(directJobDescription);
    }
    const finalJobDescription = directJobDescription ?? jobDescription;
    if (!resumeFile || !finalJobDescription) {
      console.warn('Missing resume or job description');
      alert('Please upload a resume and provide a job description.');
      return;
    }
    if (!token) {
      console.error('No authentication token. Please log in again.');
      alert('Your session has expired. Please log in again.');
      return;
    }
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', finalJobDescription);
    try {
      const res = await fetch(`${API_BASE}/match/analyze`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      setAnalysisResult({
        score: data.score,
        breakdown: data.breakdown,
        role: 'Software Engineer',
        company: 'Target Company',
        matchedSkills: data.matchedSkills,
        missingSkills: data.missingSkills,
        suggestions: data.suggestions,
      });
    } catch (err) {
      console.error('Analysis failed:', err);
      alert('Failed to analyze. Check backend and console.');
    }
  };

  const value: AppContextType = {
    resumeFile,
    jobDescription,
    analysisResult,
    setResumeFile,
    setJobDescription,
    runAnalysis,
    token,
    loading,
    applications,
    login,
    register,
    logout,
    saveApplication,
    updateApplicationStatus,
    updateApplicationNotes,
    deleteApplication,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}