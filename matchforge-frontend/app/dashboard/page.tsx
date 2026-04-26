// app/dashboard/page.tsx
'use client';
import { Layout } from '@/components/Layout';
import { StatsCards } from '@/components/StatsCards';
import { TrendChart } from '@/components/TrendChart';
import { DashboardInsights } from '@/components/DashboardInsights';
import { useAppContext } from '@/context/AppContext';

export default function DashboardPage() {
  const { applications, analysisResult } = useAppContext();

  return (
    <Layout title="Dashboard" subtitle="Overview of your job search">
      <StatsCards applications={applications} />
      
      {/* Insights component */}
      <DashboardInsights applications={applications} latestAnalysis={analysisResult} />

      <div className="mt-8 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[var(--ink3)] uppercase tracking-wide mb-4">Score Trend Over Time</h3>
        <TrendChart applications={applications} />
      </div>
    </Layout>
  );
}