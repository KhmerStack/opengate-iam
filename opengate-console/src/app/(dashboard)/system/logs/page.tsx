'use client';
import { PageHeader } from '@/components/shared/PageHeader';
import { useState } from 'react';

const mockLogs = [
  { ts: '2024-01-15T10:05:23Z', level: 'INFO', service: 'auth-service', msg: 'Token issued for user usr_001 realm master' },
  { ts: '2024-01-15T10:05:21Z', level: 'WARN', service: 'auth-service', msg: 'Failed login attempt for unknown@attacker.io' },
  { ts: '2024-01-15T10:04:55Z', level: 'INFO', service: 'user-service', msg: 'User usr_002 created by admin in realm corp' },
  { ts: '2024-01-15T10:04:10Z', level: 'INFO', service: 'session-service', msg: 'Session ses_abc123 created TTL 28800s' },
  { ts: '2024-01-15T10:03:45Z', level: 'ERROR', service: 'notification-service', msg: 'SMTP connection refused: mail.example.com:587' },
  { ts: '2024-01-15T10:03:30Z', level: 'INFO', service: 'gateway', msg: 'POST /api/auth/token 200 45ms' },
  { ts: '2024-01-15T10:03:28Z', level: 'INFO', service: 'gateway', msg: 'GET /api/users 200 12ms' },
  { ts: '2024-01-15T10:02:55Z', level: 'DEBUG', service: 'rbac-service', msg: 'Evaluate: PERMIT for usr_001 role=admin' },
  { ts: '2024-01-15T10:02:40Z', level: 'INFO', service: 'realm-service', msg: 'Realm master token lifespan updated to 600s' },
  { ts: '2024-01-15T10:01:15Z', level: 'WARN', service: 'mfa-service', msg: 'TOTP verification failed for usr_004 (attempt 2/3)' },
];

const levelColor: Record<string, string> = {
  INFO: 'text-cyan-400',
  WARN: 'text-yellow-400',
  ERROR: 'text-red-400',
  DEBUG: 'text-gray-500',
};

export default function LogsPage() {
  const [filter, setFilter] = useState('ALL');
  const filtered = filter === 'ALL' ? mockLogs : mockLogs.filter(l => l.level === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="System Logs" description="Aggregated logs from all microservices" />

      <div className="flex gap-2">
        {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'].map(l => (
          <button
            key={l}
            onClick={() => setFilter(l)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === l
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={filter === l ? { background: '#00B4D8' } : {}}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="bg-gray-950 rounded-xl overflow-hidden font-mono text-xs">
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-gray-500">opengate — system logs</span>
        </div>
        <div className="p-4 space-y-1.5 max-h-[500px] overflow-y-auto">
          {filtered.map((log, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-gray-600 flex-shrink-0">{log.ts.replace('T', ' ').replace('Z', '')}</span>
              <span className={`flex-shrink-0 w-12 ${levelColor[log.level]}`}>{log.level}</span>
              <span className="text-purple-400 flex-shrink-0 w-28 truncate">{log.service}</span>
              <span className="text-gray-300">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
