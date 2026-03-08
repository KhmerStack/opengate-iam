'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout, getUser } from '@/lib/auth';
import { Lock, Package, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

const links = [
  { href: '/products', label: 'Products',  icon: Package },
  { href: '/me',       label: 'My Profile', icon: User },
  { href: '/admin',    label: 'Admin',      icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => { setUser(getUser()); }, []);

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <nav className="bg-slate-900 text-white px-6 py-0 flex items-center h-14 gap-6 sticky top-0 z-40 shadow-lg">
      {/* Logo */}
      <Link href="/products" className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#00B4D8' }}>
          <Lock size={14} color="white" />
        </div>
        <span className="font-bold text-sm text-white">Demo App</span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                active ? 'text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              style={active ? { background: '#00B4D820', color: '#00B4D8' } : {}}
            >
              <Icon size={15} />{label}
            </Link>
          );
        })}
      </div>

      {/* User + logout */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="text-right hidden md:block">
            <p className="text-xs font-medium text-white">{user.username}</p>
            <p className="text-xs text-slate-400">{user.roles?.join(', ')}</p>
          </div>
        )}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ background: '#00B4D8' }}>
          {user?.username?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <button onClick={handleLogout}
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
