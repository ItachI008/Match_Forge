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

  // Safe average
  const avgScore = total > 0
    ? Math.round(applications.reduce((sum, app) => sum + (app.score || 0), 0) / total)
    : 0;

  // Applications sent this week (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const appsThisWeek = applications.filter(app => {
    const appliedDate = new Date(app.appliedDate);
    return appliedDate >= oneWeekAgo;
  }).length;

  // Average score change between last week and previous batch
  let avgScoreChange = 0;
  if (applications.length > 0) {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);
    
    const recentApps = applications.filter(app => new Date(app.appliedDate) >= weekAgo);
    const olderApps = applications.filter(app => 
      new Date(app.appliedDate) < weekAgo && new Date(app.appliedDate) >= twoWeeksAgo
    );
    
    const recentAvg = recentApps.length > 0
      ? recentApps.reduce((sum, app) => sum + app.score, 0) / recentApps.length
      : 0;
    const olderAvg = olderApps.length > 0
      ? olderApps.reduce((sum, app) => sum + app.score, 0) / olderApps.length
      : 0;
    avgScoreChange = Math.round(recentAvg - olderAvg);
  }

  // Interviews scheduled (includes Interview and Assessment)
  const interviews = applications?.filter(app => app.status === 'Interview' || app.status === 'Assessment').length ?? 0;
  // Offers (includes Offer and Accepted)
  const offers = applications?.filter(app => app.status === 'Offer' || app.status === 'Accepted').length ?? 0;
  
  // Pending replies: applications with status 'Applied' (no response yet)
  const pendingReplies = applications?.filter(app => app.status === 'Applied').length ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <div className="text-3xl font-display">{total}</div>
        <div className="text-sm text-[var(--ink3)]">Applications sent</div>
        <div className="text-xs text-[var(--emerald)] mt-1">+{appsThisWeek} this week</div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <div className="text-3xl font-display">{avgScore}</div>
        <div className="text-sm text-[var(--ink3)]">Avg match score</div>
        {avgScoreChange !== 0 && (
          <div className={`text-xs mt-1 ${avgScoreChange > 0 ? 'text-[var(--emerald)]' : 'text-[var(--rose)]'}`}>
            {avgScoreChange > 0 ? `+${avgScoreChange} from last batch` : `${avgScoreChange} from last batch`}
          </div>
        )}
        {avgScoreChange === 0 && (
          <div className="text-xs text-[var(--ink3)] mt-1">No change from last batch</div>
        )}
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <div className="text-3xl font-display">{interviews + offers}</div>
        <div className="text-sm text-[var(--ink3)]">Interviews scheduled</div>
        <div className="text-xs text-[var(--ink3)] mt-1">{pendingReplies} pending reply</div>
      </div>
    </div>
  );
}