'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { apiFetch, isAuthenticated, getUser } from '@/lib/auth';
import { BarChart2, Users, Activity, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [audit, setAudit]         = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    Promise.all([
      apiFetch('/api/admin/dashboard').catch(() => { setForbidden(true); return null; }),
      apiFetch('/api/admin/audit').catch(() => null),
    ]).then(([d, a]) => { setDashboard(d); setAudit(a); }).finally(() => setLoading(false));
  }, []);

  if (forbidden) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle size={32} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2 text-sm">
          You need the <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">admin</code> role to view this page.
          Your current roles: <strong>{user?.roles?.join(', ') || 'none'}</strong>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Logged in as <span className="font-medium">{dashboard?.adminUser}</span>
              {' '}· realm <span className="font-medium">{dashboard?.realm}</span>
            </p>
          </div>
          <span className="text-xs text-gray-400">{dashboard?.serverTime?.slice(0, 19).replace('T', ' ')} UTC</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-gray-100" />)}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Active Users',  value: dashboard?.stats?.activeUsers, icon: Users,    color: '#00B4D8' },
                { label: 'Total Requests',value: dashboard?.stats?.requests,    icon: Activity, color: '#10b981' },
                { label: 'Uptime',        value: dashboard?.stats?.uptime,      icon: BarChart2,color: '#8b5cf6' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">{label}</p>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: color + '20' }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{value?.toLocaleString?.() ?? value}</p>
                </div>
              ))}
            </div>

            {/* Audit log */}
            {audit && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={16} style={{ color: '#00B4D8' }} />
                  <h2 className="font-semibold text-gray-900">Audit Events</h2>
                  <span className="text-xs text-gray-400 ml-auto">by {audit.requestedBy}</span>
                </div>
                <div className="space-y-3">
                  {audit.events?.map((e: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      {e.type.includes('SUCCESS') || e.type.includes('CREATED') || e.type.includes('RESET')
                        ? <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                        : <XCircle size={15} className="text-red-500 flex-shrink-0" />
                      }
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{e.type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-400">{e.user}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={11} /> {e.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
