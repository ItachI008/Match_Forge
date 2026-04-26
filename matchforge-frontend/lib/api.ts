// lib/api.ts
const API_BASE = 'http://localhost:8080/api';

export async function analyzeMatch(resumeFile: File, jobDescription: string) {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('jobDescription', jobDescription);

  const response = await fetch(`${API_BASE}/match/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Analysis failed');
  return response.json();
}

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/resumes/upload`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

export async function parseJobDescription(rawText: string) {
  const response = await fetch(`${API_BASE}/jobs/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rawText),
  });
  return response.json();
}