'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { LogOut, LayoutDashboard, Upload, FileText, LineChart, MessageSquare, ListChecks } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Resume', href: '/upload', icon: Upload },
  { name: 'Job Description', href: '/job-description', icon: FileText },
  { name: 'Match Results', href: '/match-results', icon: LineChart },
  { name: 'AI Assistant', href: '/ai-assistant', icon: MessageSquare },
  { name: 'Application Tracker', href: '/applications', icon: ListChecks },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAppContext();

  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--ink)]"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--accent)] text-white p-5 flex flex-col gap-2 transition-transform duration-300 z-50 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/15">
          <div className="text-2xl font-display">
            Match<span className="text-[var(--gold)]">Forge</span> AI
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all mt-auto w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>
    </>
  );
}