'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { apiFetch, isAuthenticated } from '@/lib/auth';
import { User, Shield, Globe, Key } from 'lucide-react';

export default function MePage() {
  const router = useRouter();
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    apiFetch('/api/me').then(setData).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse" />
        ) : data ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                style={{ background: '#0D1B2A' }}>
                {(data.username ?? 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{data.username || data.userId}</p>
                <p className="text-sm text-gray-500">{data.email || 'No email'}</p>
                <div className="flex gap-2 mt-2">
                  {(data.roles ?? []).map((r: string) => (
                    <span key={r} className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                      style={{ background: r === 'admin' ? '#0D1B2A' : '#e0f7fc', color: r === 'admin' ? '#00B4D8' : '#0D1B2A' }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Key,    label: 'User ID',  value: data.userId },
                { icon: Globe,  label: 'Realm',    value: data.realm || 'master' },
                { icon: Shield, label: 'Is Admin', value: data.isAdmin ? 'Yes' : 'No' },
                { icon: User,   label: 'Roles',    value: (data.roles ?? []).join(', ') || 'none' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={15} style={{ color: '#00B4D8' }} />
                    <span className="text-xs font-medium text-gray-500">{label}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">JWT Claims from OpenGate</p>
              <pre className="text-xs text-green-400 font-mono overflow-auto whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
