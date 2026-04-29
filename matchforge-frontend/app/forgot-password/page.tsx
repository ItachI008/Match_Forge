'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setMessage(data.message || 'Check your email for reset link.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
      <div className="bg-[var(--card)] p-8 rounded-xl border border-[var(--border)] w-96">
        <h2 className="text-2xl font-display mb-6">Forgot Password</h2>
        {message && <div className="text-green-600 text-sm mb-4">{message}</div>}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-6 border rounded bg-[var(--paper)] text-[var(--ink)]"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary btn w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="text-center text-sm text-[var(--ink3)] mt-4">
          Remember your password?{' '}
          <Link href="/login" className="text-[var(--accent)] font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}