// app/match-results/page.tsx
'use client';
import { Layout } from '@/components/Layout';
import { MatchScoreCard } from '@/components/MatchScoreCard';
import { SkillsAnalysis } from '@/components/SkillAnalysis';
import { SuggestionsList } from '@/components/SuggestionsList';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';

export default function MatchResultsPage() {
  const { analysisResult } = useAppContext();
  const [activeTab, setActiveTab] = useState<'skills' | 'suggestions'>('skills');

  if (!analysisResult) {
    return (
      <Layout title="Match Results" subtitle="No analysis found">
        <div className="text-center py-12">Please upload a resume and job description first.</div>
      </Layout>
    );
  }

  return (
    <Layout title="Match Results" subtitle={`${analysisResult.role} @ ${analysisResult.company}`}>
      <MatchScoreCard score={analysisResult.score} breakdown={analysisResult.breakdown} />
      
      <div className="flex gap-2 border-b border-[var(--border)] mt-8">
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'skills' ? 'text-[var(--ink)] border-b-2 border-[var(--accent)]' : 'text-[var(--ink3)]'}`}
        >
          Skill Analysis
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'suggestions' ? 'text-[var(--ink)] border-b-2 border-[var(--accent)]' : 'text-[var(--ink3)]'}`}
        >
          Suggestions
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'skills' && <SkillsAnalysis matched={analysisResult.matchedSkills} missing={analysisResult.missingSkills} />}
        {activeTab === 'suggestions' && <SuggestionsList suggestions={analysisResult.suggestions} />}
      </div>
    </Layout>

    
  );
}