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
  // Resume & analysis
  resumeFile: File | null;
  jobDescription: string;
  analysisResult: AnalysisResult | null;
  setResumeFile: (file: File | null) => void;
  setJobDescription: (jd: string) => void;
  runAnalysis: (jd?: string) => Promise<void>;
  // Auth & applications
  token: string | null;
  loading: boolean;
  applications: Application[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  saveApplication: (company: string, role: string, score: number, status: string, appliedDate?: string, notes?: string) => Promise<void>;
  updateApplicationStatus: (id: number, status: string) => Promise<void>;
  updateApplicationNotes: (id: number, notes: string) => Promise<void>;
  deleteApplication: (id: number) => Promise<void>;   // <-- added
};

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
  // Resume & job description state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  // Check for existing token on mount
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

  // Fetch applications using token
  const fetchApplications = async (authToken: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/applications', {
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

  // Login
  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:8080/api/auth/login', {
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

  // Register
  const register = async (email: string, password: string) => {
    const res = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Registration failed');
  };

  // Logout
  const logout = () => {
    setToken(null);
    setApplications([]);
    removeCookie('token');
  };

  // Save a new application
  const saveApplication = async (company: string, role: string, score: number, status: string, appliedDate?: string, notes?: string) => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch('http://localhost:8080/api/applications', {
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

  // Update application status
  const updateApplicationStatus = async (id: number, status: string) => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`http://localhost:8080/api/applications/${id}?status=${status}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to update status');
    const updated = await res.json();
    setApplications((prev) => prev.map((app) => (app.id === id ? updated : app)));
  };

  // Update application notes
  const updateApplicationNotes = async (id: number, notes: string) => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`http://localhost:8080/api/applications/${id}/notes`, {
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

  // Delete application
  const deleteApplication = async (id: number) => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`http://localhost:8080/api/applications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete application');
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  // Run match analysis
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
      const res = await fetch('http://localhost:8080/api/match/analyze', {
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
    deleteApplication,        // <-- added
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}