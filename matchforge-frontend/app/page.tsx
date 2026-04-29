// app/page.tsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  const { token } = useAppContext();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  // Features list
  const features = [
    {
      title: '📄 Resume Upload',
      description: 'Upload your resume (PDF/DOCX) – our AI extracts all your skills and experience instantly.',
    },
    {
      title: '🤖 AI Match Analysis',
      description: 'Get a detailed match score (0‑100) with category breakdowns (skills, experience, keywords, projects).',
    },
    {
      title: '📝 Job Description Input',
      description: 'Paste any job posting and see how your resume aligns with the role.',
    },
    {
      title: '🧠 AI Assistant',
      description: 'Ask follow‑up questions and receive actionable advice to improve your resume.',
    },
    {
      title: '📋 Application Tracker',
      description: 'Keep track of all your applications, update statuses, and add interview notes.',
    },
    {
      title: '📊 Dashboard Analytics',
      description: 'Visualise your job search progress with stats and trend charts.',
    },
    {
      title: '💾 Persistent Storage',
      description: 'Your data is saved in a PostgreSQL database – never lose your progress.',
    },
    {
      title: '🌓 Dark / Light Mode',
      description: 'Choose the theme that suits you best.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-3xl font-display text-[var(--ink)]">
          Match<span className="text-[var(--gold)]">Forge</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="btn">
            Login
          </Link>
          <Link href="/register" className="btn-primary btn">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display text-[var(--ink)] mb-6">
            Forge Your <span className="text-[var(--emerald)]">Perfect Career</span>
          </h1>
          <p className="text-xl text-[var(--ink3)] max-w-2xl mx-auto mb-8">
            AI‑powered resume optimisation and job tracking platform that helps you land interviews
            at your dream companies. Get instant match scores, smart suggestions, and never lose track
            of your applications.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="btn-primary btn text-lg px-8 py-3">
              Get Started
            </Link>
            <Link href="/login" className="btn text-lg px-8 py-3">
              Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2 text-[var(--ink)]">{feature.title}</h3>
              <p className="text-sm text-[var(--ink3)] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <h2 className="text-2xl font-display mb-3">Ready to boost your job search?</h2>
          <p className="text-[var(--ink3)] mb-6">Join hundreds of job seekers who improved their resumes with MatchForge</p>
          <Link href="/register" className="btn-primary btn text-lg px-8 py-3">
            Create Free Account
          </Link>
        </div>
      </main>
    </div>
  );
}