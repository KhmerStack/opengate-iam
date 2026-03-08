'use client';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { Monitor, Smartphone, Globe, Trash2 } from 'lucide-react';

// Mock sessions — real impl would call session API with realm filter
const mockSessions = [
  { sessionId: 'ses_abc123', userId: 'usr_001', ipAddress: '192.168.1.10', userAgent: 'Chrome/Mac', createdAt: '2024-01-15T10:00:00Z', expiresAt: '2024-01-15T18:00:00Z' },
  { sessionId: 'ses_def456', userId: 'usr_002', ipAddress: '10.0.0.5', userAgent: 'Firefox/Linux', createdAt: '2024-01-15T09:30:00Z', expiresAt: '2024-01-15T17:30:00Z' },
  { sessionId: 'ses_ghi789', userId: 'usr_001', ipAddress: '172.16.0.1', userAgent: 'Mobile/iOS', createdAt: '2024-01-15T08:00:00Z', expiresAt: '2024-01-15T16:00:00Z' },
];

function DeviceIcon({ ua }: { ua: string }) {
  if (ua.includes('Mobile') || ua.includes('iOS') || ua.includes('Android')) return <Smartphone size={16} className="text-gray-400" />;
  return <Monitor size={16} className="text-gray-400" />;
}

export default function RealmSessionsPage({ params }: { params: { realmId: string } }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Sessions"
        description={`Live sessions in realm: ${params.realmId}`}
        action={
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium bg-red-500 hover:bg-red-600 transition-colors">
            <Trash2 size={16} /> Terminate All
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Session</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Device</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">IP Address</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Expires</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockSessions.map(s => (
              <tr key={s.sessionId} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-mono text-xs text-gray-700">{s.sessionId}</p>
                  <p className="text-xs text-gray-400 mt-0.5">User: {s.userId}</p>
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <DeviceIcon ua={s.userAgent} />
                    <span className="text-gray-600 text-xs">{s.userAgent}</span>
                  </div>
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Globe size={14} className="text-gray-400" />
                    <span className="font-mono text-xs text-gray-600">{s.ipAddress}</span>
                  </div>
                </td>
                <td className="px-5 py-3 hidden lg:table-cell">
                  <Badge variant="green">Active</Badge>
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
