'use client';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { Activity, Globe, Monitor, Smartphone, Trash2 } from 'lucide-react';

const mockSessions = [
  { sessionId: 'ses_abc123', userId: 'usr_001', realm: 'master', ipAddress: '192.168.1.10', userAgent: 'Chrome 120 / macOS', createdAt: '2024-01-15T10:00:00Z' },
  { sessionId: 'ses_def456', userId: 'usr_002', realm: 'corp', ipAddress: '10.0.0.5', userAgent: 'Firefox 121 / Linux', createdAt: '2024-01-15T09:30:00Z' },
  { sessionId: 'ses_ghi789', userId: 'usr_003', realm: 'master', ipAddress: '172.16.0.1', userAgent: 'Mobile Safari / iOS', createdAt: '2024-01-15T08:00:00Z' },
  { sessionId: 'ses_jkl012', userId: 'usr_001', realm: 'dev', ipAddress: '10.10.10.1', userAgent: 'Chrome 120 / Windows', createdAt: '2024-01-15T07:45:00Z' },
];

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Sessions"
        description="All live user sessions"
        action={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity size={16} className="text-green-500" />
            {mockSessions.length} active
          </div>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Session ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Realm</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Device</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">IP</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockSessions.map(s => (
              <tr key={s.sessionId} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-mono text-xs text-gray-700">{s.sessionId}</p>
                  <p className="text-xs text-gray-400">{s.userId}</p>
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <Badge variant="cyan">{s.realm}</Badge>
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    {s.userAgent.includes('Mobile') ? <Smartphone size={14} className="text-gray-400" /> : <Monitor size={14} className="text-gray-400" />}
                    <span className="text-xs text-gray-600 truncate max-w-[150px]">{s.userAgent}</span>
                  </div>
                </td>
                <td className="px-5 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Globe size={13} className="text-gray-400" />
                    <span className="font-mono text-xs text-gray-600">{s.ipAddress}</span>
                  </div>
                </td>
                <td className="px-5 py-3 hidden lg:table-cell text-xs text-gray-400">
                  {new Date(s.createdAt).toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
