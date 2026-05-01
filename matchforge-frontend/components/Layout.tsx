'use client';
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex min-h-screen bg-[var(--paper)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Mobile header with theme toggle */}
        <div className="md:hidden flex justify-end items-center p-4 border-b border-[var(--border)] bg-[var(--card)]">
          <ThemeToggle />
        </div>
        <MobileNav />

        <header className="hidden md:flex justify-between items-center px-6 py-4 border-b border-[var(--border)] bg-[var(--card)]">
          <div>
            <h1 className="text-2xl font-display text-[var(--ink)]">{title}</h1>
            {subtitle && <p className="text-sm text-[var(--ink3)]">{subtitle}</p>}
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}