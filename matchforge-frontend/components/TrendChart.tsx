// components/TrendChart.tsx
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

interface Application {
  id: number;
  company: string;
  score: number;
  appliedDate: string;
}

export function TrendChart({ applications }: { applications: Application[] }) {
  // Sort by date (assuming appliedDate is like "Apr 18", "Apr 20" – we can parse or use index)
  const data = useMemo(() => {
    if (!applications.length) {
      return [{ name: 'No data', score: 0 }];
    }
    // Use the most recent 8 applications, sorted by appliedDate (simple string sort for demo)
    const sorted = [...applications].sort((a, b) => {
      const dateA = new Date(a.appliedDate + ' 2024');
      const dateB = new Date(b.appliedDate + ' 2024');
      return dateA.getTime() - dateB.getTime();
    });
    return sorted.map(app => ({ name: app.company.slice(0, 10), score: app.score }));
  }, [applications]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--ink3)" fontSize={11} />
          <YAxis domain={[40, 100]} stroke="var(--ink3)" fontSize={11} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--ink)' }} />
          <Line type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={2} dot={{ r: 4, fill: 'var(--emerald)' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}