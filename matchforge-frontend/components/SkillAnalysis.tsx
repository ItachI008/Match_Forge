'use client';

interface SkillsAnalysisProps {
  matched: string[];
  missing: {
    critical: string[];
    niceToHave: string[];
    bonus: string[];
  };
}

export function SkillsAnalysis({ matched, missing }: SkillsAnalysisProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-xs font-semibold text-[var(--ink3)] uppercase tracking-wide mb-3">Matched Skills</h3>
        <div className="flex flex-wrap gap-2">
          {matched.map(skill => (
            <span key={skill} className="tag-match px-3 py-1 rounded-full text-xs font-medium">{skill}</span>
          ))}
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-xs font-semibold text-[var(--ink3)] uppercase tracking-wide mb-3">Missing Skills</h3>
        <div className="space-y-4">
          <div>
            <div className="text-xs font-medium text-[var(--ink3)] mb-2">CRITICAL</div>
            <div className="flex flex-wrap gap-2">
              {missing.critical.map(skill => (
                <span key={skill} className="tag-miss-critical px-3 py-1 rounded-full text-xs font-medium">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-[var(--ink3)] mb-2">GOOD TO HAVE</div>
            <div className="flex flex-wrap gap-2">
              {missing.niceToHave.map(skill => (
                <span key={skill} className="tag-miss-nice px-3 py-1 rounded-full text-xs font-medium">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-[var(--ink3)] mb-2">BONUS</div>
            <div className="flex flex-wrap gap-2">
              {missing.bonus.map(skill => (
                <span key={skill} className="tag-bonus px-3 py-1 rounded-full text-xs font-medium">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}