'use client';

interface Application {
  id: number;
  company: string;
  role: string;
  score: number;
  status: string;
  appliedDate: string;
}

export function StatsCards({ applications }: { applications: Application[] }) {
  const total = applications?.length ?? 0;

  // Safe average: if total is 0, avgScore = 0
  const avgScore = total > 0
    ? Math.round(applications.reduce((sum, app) => sum + (app.score || 0), 0) / total)
    : 0;

  const interviews = applications?.filter(app => app.status === 'Interview').length ?? 0;
  const offers = applications?.filter(app => app.status === 'Offer').length ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <div className="text-3xl font-display">{total}</div>
        <div className="text-sm text-[var(--ink3)]">Applications sent</div>
        <div className="text-xs text-[var(--emerald)] mt-1">+3 this week</div>
      </div>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <div className="text-3xl font-display">{avgScore}</div>
        <div className="text-sm text-[var(--ink3)]">Avg match score</div>
        <div className="text-xs text-[var(--emerald)] mt-1">+6 from last batch</div>
      </div>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <div className="text-3xl font-display">{interviews + offers}</div>
        <div className="text-sm text-[var(--ink3)]">Interviews scheduled</div>
        <div className="text-xs text-[var(--rose)] mt-1">2 pending reply</div>
      </div>
    </div>
  );
}