'use client';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

const events = [
  { id: 1, type: 'LOGIN_SUCCESS', userId: 'usr_001', realm: 'master', ip: '192.168.1.10', time: '2024-01-15T10:05:00Z', details: 'Password auth' },
  { id: 2, type: 'LOGIN_FAILURE', userId: 'unknown', realm: 'master', ip: '203.0.113.42', time: '2024-01-15T10:03:00Z', details: 'Invalid credentials' },
  { id: 3, type: 'USER_CREATED', userId: 'usr_002', realm: 'corp', ip: '10.0.0.1', time: '2024-01-15T09:55:00Z', details: 'Admin-created' },
  { id: 4, type: 'PASSWORD_RESET', userId: 'usr_003', realm: 'master', ip: '172.16.0.5', time: '2024-01-15T09:40:00Z', details: 'Email reset flow' },
  { id: 5, type: 'TOKEN_REFRESH', userId: 'usr_001', realm: 'master', ip: '192.168.1.10', time: '2024-01-15T09:30:00Z', details: 'Refresh token used' },
  { id: 6, type: 'SESSION_TERMINATED', userId: 'usr_004', realm: 'dev', ip: '10.10.0.2', time: '2024-01-15T09:10:00Z', details: 'Admin revoked' },
  { id: 7, type: 'LOGIN_FAILURE', userId: 'unknown', realm: 'corp', ip: '198.51.100.99', time: '2024-01-15T09:00:00Z', details: 'Account locked' },
  { id: 8, type: 'CLIENT_CREATED', userId: 'admin', realm: 'master', ip: '10.0.0.1', time: '2024-01-15T08:45:00Z', details: 'New OAuth client' },
];

const typeConfig: Record<string, { icon: React.ElementType; variant: 'green' | 'red' | 'cyan' | 'orange' | 'gray' }> = {
  LOGIN_SUCCESS: { icon: CheckCircle, variant: 'green' },
  LOGIN_FAILURE: { icon: XCircle, variant: 'red' },
  USER_CREATED: { icon: Info, variant: 'cyan' },
  PASSWORD_RESET: { icon: AlertTriangle, variant: 'orange' },
  TOKEN_REFRESH: { icon: Info, variant: 'gray' },
  SESSION_TERMINATED: { icon: Info, variant: 'gray' },
  CLIENT_CREATED: { icon: Info, variant: 'cyan' },
};

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Audit Events" description="Security event log for all realms" />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">User</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Realm</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Details</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {events.map(e => {
              const cfg = typeConfig[e.type] ?? { icon: Info, variant: 'gray' as const };
              const Icon = cfg.icon;
              return (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Icon size={15} className={cfg.variant === 'red' ? 'text-red-500' : cfg.variant === 'green' ? 'text-green-500' : 'text-gray-400'} />
                      <Badge variant={cfg.variant}>{e.type.replace(/_/g, ' ')}</Badge>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-600 font-mono text-xs">{e.userId}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <Badge variant="cyan">{e.realm}</Badge>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-xs text-gray-500">{e.details}</td>
                  <td className="px-5 py-3 hidden lg:table-cell text-xs text-gray-400">
                    {new Date(e.time).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
