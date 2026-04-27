'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Upload, FileText, LineChart, MessageSquare, LogOut, ListChecks, FormInput } from 'lucide-react';import { useAppContext } from '@/context/AppContext';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Resume', href: '/upload', icon: Upload },
  { name: 'Job Description', href: '/job-description', icon: FileText },
  { name: 'Match Results', href: '/match-results', icon: LineChart },
  { name: 'AI Assistant', href: '/ai-assistant', icon: MessageSquare },
  { name: 'Application Tracker', href: '/applications', icon: ListChecks },
  { name: 'Manual Entry', href: '/manual-entry', icon: FormInput },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAppContext();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-[var(--accent)] text-white p-5 flex flex-col gap-2 hidden md:flex h-screen sticky top-0">
      <div className="text-2xl font-display mb-8 pb-4 border-b border-white/15">
        Match<span className="text-[var(--gold)]">Forge</span> AI
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}