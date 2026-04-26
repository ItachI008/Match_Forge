'use client';
import { useState } from 'react';

export function JobDescriptionForm({ onSubmit }: { onSubmit: (jd: string) => void }) {
  const [jd, setJd] = useState('');

  return (
    <div>
      <textarea
        className="w-full min-h-[300px] p-4 border border-[var(--border)] rounded-xl bg-[var(--card)] text-[var(--ink)] font-body resize-y focus:outline-none focus:border-[var(--ink3)] transition-all"
        placeholder="Paste the job description here — e.g. 'We are looking for a Senior Software Engineer to join our Payments team...'"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />
      <button onClick={() => onSubmit(jd)} className="btn-primary btn w-full mt-4 py-3">
        Analyze Match →
      </button>
    </div>
  );
}