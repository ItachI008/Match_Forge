'use client';

interface MatchScoreCardProps {
  score: number;
  breakdown: Record<string, number>;
}

export function MatchScoreCard({ score, breakdown }: MatchScoreCardProps) {
  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 70 ? 'var(--emerald)' : score >= 50 ? 'var(--gold)' : 'var(--rose)';

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
      <div className="relative w-36 h-36 flex-shrink-0">
        <svg className="w-full h-full" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="58" fill="none" stroke="var(--border)" strokeWidth="12" />
          <circle
            cx="70"
            cy="70"
            r="58"
            fill="none"
            stroke={scoreColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-display" style={{ color: scoreColor }}>{score}</span>
          <span className="text-xs text-[var(--ink3)]">/ 100</span>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-display mb-1">{score >= 70 ? 'Strong Match' : score >= 50 ? 'Moderate Match' : 'Needs Work'}</h2>
        <p className="text-sm text-[var(--ink3)] mb-4">Your resume aligns well with the role. Address critical gaps to improve.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(breakdown).map(([key, val]) => (
            <div key={key} className="bg-[var(--paper)] rounded-lg p-2">
              <div className="text-lg font-semibold">{val}%</div>
              <div className="text-xs text-[var(--ink3)] capitalize">{key}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}