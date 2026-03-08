'use client';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

const labels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/realms': 'Realms',
  '/users': 'Users',
  '/roles': 'Roles',
  '/clients': 'Clients',
  '/sessions': 'Sessions',
  '/system/health': 'System Health',
  '/system/events': 'Audit Events',
  '/system/logs': 'Logs',
  '/settings': 'Settings',
};

export function Topbar() {
  const pathname = usePathname();
  const title = Object.entries(labels).find(([k]) => pathname.startsWith(k))?.[1] ?? 'OpenGate';

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-400 w-56"
          />
        </div>
        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: '#00B4D8' }}>
          A
        </div>
      </div>
    </header>
  );
}
