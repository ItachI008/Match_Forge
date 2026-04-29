// components/DashboardInsights.tsx
'use client';

interface Application {
  id: number;
  company: string;
  role: string;
  score: number;
  status: string;
  appliedDate: string;
}

interface AnalysisResult {
  score: number;
  missingSkills: { critical: string[]; niceToHave: string[]; bonus: string[] };
  suggestions: { id: string; title: string; description: string; priority: string }[];
}

interface DashboardInsightsProps {
  applications: Application[];
  latestAnalysis: AnalysisResult | null;
}

export function DashboardInsights({ applications, latestAnalysis }: DashboardInsightsProps) {
  const totalApps = applications.length;
  
  // Updated status mappings to match Application Tracker
  const applied = applications.filter(app => app.status === 'Applied').length;
  const interviews = applications.filter(app => app.status === 'Interview' || app.status === 'Assessment').length;
  const offers = applications.filter(app => app.status === 'Offer' || app.status === 'Accepted').length;
  const rejected = applications.filter(app => app.status === 'Rejected').length;
  // Ghosted is not used in funnel but you can add if needed
  const ghosted = applications.filter(app => app.status === 'Ghosted').length;

  const offerRate = totalApps > 0 ? Math.round((offers / totalApps) * 100) : 0;
  const interviewRate = totalApps > 0 ? Math.round(((interviews + offers) / totalApps) * 100) : 0;

  // Top companies by score (still works)
  const topCompanies = [...applications]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Application funnel */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[var(--ink3)] uppercase tracking-wide mb-3">Application Funnel</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Total applications</span>
            <span className="font-mono font-bold">{totalApps}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>📄 Applied</span>
            <span className="font-mono">{applied}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>🎯 Interviews (incl. Assessment)</span>
            <span className="font-mono">{interviews}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>🏆 Offers / Accepted</span>
            <span className="font-mono font-bold text-[var(--emerald)]">{offers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>❌ Rejected</span>
            <span className="font-mono text-[var(--rose)]">{rejected}</span>
          </div>
          {ghosted > 0 && (
            <div className="flex justify-between items-center text-gray-500">
              <span>👻 Ghosted</span>
              <span className="font-mono">{ghosted}</span>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-xs">
            <span>Offer rate</span>
            <span>{offerRate}%</span>
          </div>
          <div className="h-2 bg-[var(--paper)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--emerald)] rounded-full" style={{ width: `${offerRate}%` }} />
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span>Interview rate</span>
            <span>{interviewRate}%</span>
          </div>
          <div className="h-2 bg-[var(--paper)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${interviewRate}%` }} />
          </div>
        </div>
      </div>

      {/* Top matches & latest insight */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[var(--ink3)] uppercase tracking-wide mb-3">Top Matches</h3>
        {topCompanies.length > 0 ? (
          <div className="space-y-3">
            {topCompanies.map((app) => (
              <div key={app.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{app.company}</span>
                  <span className="text-xs text-[var(--ink3)] ml-2">{app.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-[var(--paper)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--emerald)] rounded-full" style={{ width: `${app.score}%` }} />
                  </div>
                  <span className="font-mono text-sm">{app.score}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--ink3)]">No applications yet. Add some to see insights.</p>
        )}

        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--ink3)] uppercase tracking-wide mb-2">Latest Match Insight</h3>
          {latestAnalysis ? (
            <>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-display">{latestAnalysis.score}</div>
                <div className="text-xs text-[var(--ink3)]">Current score</div>
              </div>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">Top gap:</span>{' '}
                  {latestAnalysis.missingSkills.critical[0] || 'None'}
                </p>
                <p className="text-sm text-[var(--ink3)] mt-1">
                  {latestAnalysis.suggestions[0]?.title || 'No suggestions yet'}
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--ink3)]">No analysis yet. Upload a resume and job description.</p>
          )}
        </div>
      </div>
    </div>
  );
}