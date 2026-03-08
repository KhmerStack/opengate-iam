'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Globe, Users, Shield, AppWindow,
  MonitorCheck, FileText, Activity, Settings, LogOut, Lock
} from 'lucide-react';

const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Realms', href: '/realms', icon: Globe },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Roles', href: '/roles', icon: Shield },
  { label: 'Clients', href: '/clients', icon: AppWindow },
  { label: 'Sessions', href: '/sessions', icon: Activity },
];

const systemNav = [
  { label: 'Health', href: '/system/health', icon: MonitorCheck },
  { label: 'Events', href: '/system/events', icon: FileText },
  { label: 'Logs', href: '/system/logs', icon: FileText },
  { label: 'Settings', href: '/settings', icon: Settings },
];

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? 'bg-[#00B4D8]/20 text-[#00B4D8] font-medium'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('opengate_token');
    localStorage.removeItem('opengate_refresh_token');
    localStorage.removeItem('opengate_user');
    sessionStorage.removeItem('pkce_verifier');
    sessionStorage.removeItem('oauth_state');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: '#0D1B2A' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#00B4D8' }}>
            <Lock size={16} color="white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">OpenGate</p>
            <p className="text-gray-500 text-xs">IAM Console</p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Management</p>
        {nav.map(item => <NavItem key={item.href} {...item} />)}

        <div className="pt-4">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">System</p>
          {systemNav.map(item => <NavItem key={item.href} {...item} />)}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
