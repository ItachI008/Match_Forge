'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAppContext();

  const sendOtp = async () => {
    if (!email || !password || password !== confirmPassword) {
      setError('Please fill all fields and ensure passwords match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setStep('otp');
      alert('OTP sent to your email!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyAndRegister = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/auth/verify-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      // Auto-login after registration
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
      <div className="bg-[var(--card)] p-8 rounded-xl border border-[var(--border)] w-96">
        <h2 className="text-2xl font-display mb-6">Create Account</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {step === 'email' ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded bg-[var(--paper)] text-[var(--ink)]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded bg-[var(--paper)] text-[var(--ink)]"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mb-6 border rounded bg-[var(--paper)] text-[var(--ink)]"
              required
            />
            <button onClick={sendOtp} disabled={loading} className="btn-primary btn w-full">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-6 border rounded bg-[var(--paper)] text-[var(--ink)]"
              required
            />
            <button onClick={verifyAndRegister} disabled={loading} className="btn-primary btn w-full">
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>
            <button
              onClick={() => setStep('email')}
              className="text-sm text-[var(--ink3)] mt-4 hover:underline w-full text-center"
            >
              ← Back
            </button>
          </>
        )}
        <p className="text-center text-sm text-[var(--ink3)] mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--accent)] font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}