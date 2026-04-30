'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
        <div className="bg-[var(--card)] p-8 rounded-xl border border-[var(--border)] w-96 text-center">
          <h2 className="text-2xl font-display mb-4">Invalid Link</h2>
          <p className="text-[var(--ink3)] mb-4">The reset link is missing or invalid.</p>
          <Link href="/forgot-password" className="btn-primary btn w-full inline-block text-center">Try again</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
      <div className="bg-[var(--card)] p-8 rounded-xl border border-[var(--border)] w-96">
        <h2 className="text-2xl font-display mb-6">Set New Password</h2>
        {message && <div className="text-green-600 text-sm mb-4">{message}</div>}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password (min. 6 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-[var(--paper)] text-[var(--ink)]"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mb-6 border rounded bg-[var(--paper)] text-[var(--ink)]"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary btn w-full">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className="text-center text-sm text-[var(--ink3)] mt-4">
          <Link href="/login" className="text-[var(--accent)] font-medium">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}