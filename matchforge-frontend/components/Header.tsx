// components/Header.tsx
'use client';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-[var(--border)] bg-[var(--card)]">
      <div>
        <h1 className="text-2xl font-display text-[var(--ink)]">{title}</h1>
        {subtitle && <p className="text-sm text-[var(--ink3)]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
  <ThemeToggle />
  <button className="btn-primary btn text-sm">Export PDF</button>
</div>
    </header>
  );
}