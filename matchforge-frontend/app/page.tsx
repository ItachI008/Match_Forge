// app/page.tsx (Landing Page)
'use client';
import Link from 'next/link';
import { ArrowRight, Sparkles, FileText, BarChart3, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-display text-[var(--ink)]">Match<span className="text-[var(--gold)]">Forge</span> AI</div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/dashboard" className="btn-primary btn">Launch App →</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display text-[var(--ink)] mb-6">Forge Your <span className="text-[var(--emerald)]">Perfect Match</span></h1>
          <p className="text-xl text-[var(--ink3)] max-w-2xl mx-auto">AI-powered resume optimization that helps you land interviews at top companies. Get instant match scores, keyword analysis, and smart rewrite suggestions.</p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/upload" className="btn-primary btn flex items-center gap-2">Get Started <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/dashboard" className="btn flex items-center gap-2">View Demo <Sparkles className="w-4 h-4" /></Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <FileText className="w-10 h-10 text-[var(--emerald)] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
            <p className="text-[var(--ink3)]">PDF or DOCX, our AI extracts skills and experience instantly.</p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <BarChart3 className="w-10 h-10 text-[var(--emerald)] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-[var(--ink3)]">Get detailed match scores and keyword density analysis.</p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <Shield className="w-10 h-10 text-[var(--emerald)] mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Rewrite</h3>
            <p className="text-[var(--ink3)]">Optimize bullet points with ATS-friendly language suggestions.</p>
          </div>
        </div>
      </main>
    </div>
  );
}