'use client';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  priority: string;  
}

export function SuggestionsList({ suggestions }: { suggestions: Suggestion[] }) {
  const priorityStyles: Record<string, string> = {
    critical: 'bg-[#fcebeb] text-[#791f1f] dark:bg-[#c0392b]/30 dark:text-[#fca5a5]',
    high: 'bg-[#faeeda] text-[#633806] dark:bg-[#ef9f27]/30 dark:text-[#fbbf24]',
    recommended: 'bg-[#eaf3de] text-[#27500a] dark:bg-[#2d6a4f]/30 dark:text-[#6fdc8c]',
  };

  return (
    <div className="space-y-3">
      {suggestions.map((sug) => (
        <div key={sug.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${priorityStyles[sug.priority] || 'bg-gray-100'}`}>
            {sug.priority === 'critical' && '!'}
            {sug.priority === 'high' && '▲'}
            {sug.priority === 'recommended' && '✓'}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{sug.title}</h4>
            <p className="text-sm text-[var(--ink3)]">{sug.description}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded font-medium ${priorityStyles[sug.priority] || 'bg-gray-100'}`}>
            {sug.priority === 'critical' ? 'Critical' : sug.priority === 'high' ? 'High impact' : 'Recommended'}
          </span>
        </div>
      ))}
    </div>
  );
}