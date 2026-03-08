'use client';
import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/lib/api/stats';
import { Users, Globe, AppWindow, Activity } from 'lucide-react';

const MOCK: Record<string, number> = {
  totalUsers: 1284,
  activeSessions: 342,
  registeredClients: 48,
  totalRealms: 5,
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}

function StatCard({ label, value, icon: Icon, color, sub }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: color + '20' }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export function StatsCards() {
  const { data } = useQuery({ queryKey: ['stats'], queryFn: statsApi.get });
  const stats = data ?? MOCK;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="#00B4D8" sub="+12 this week" />
      <StatCard label="Active Sessions" value={stats.activeSessions} icon={Activity} color="#10b981" sub="Right now" />
      <StatCard label="OAuth Clients" value={stats.registeredClients} icon={AppWindow} color="#8b5cf6" sub="Registered" />
      <StatCard label="Realms" value={stats.totalRealms ?? 5} icon={Globe} color="#f59e0b" sub="Active tenants" />
    </div>
  );
}
