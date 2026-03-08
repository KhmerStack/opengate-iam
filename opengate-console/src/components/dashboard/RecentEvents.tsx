'use client';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

const events = [
  { type: 'LOGIN_SUCCESS', user: 'alice@example.com', realm: 'master', time: '2 min ago', ok: true },
  { type: 'LOGIN_FAILURE', user: 'bob@corp.com', realm: 'corp', time: '5 min ago', ok: false },
  { type: 'USER_CREATED', user: 'carol@example.com', realm: 'master', time: '12 min ago', ok: true },
  { type: 'PASSWORD_RESET', user: 'dan@corp.com', realm: 'corp', time: '34 min ago', ok: true },
  { type: 'LOGIN_FAILURE', user: 'unknown@attacker.io', realm: 'master', time: '1 hr ago', ok: false },
  { type: 'SESSION_TERMINATED', user: 'eve@example.com', realm: 'dev', time: '2 hr ago', ok: true },
];

const icons: Record<string, React.ElementType> = {
  LOGIN_SUCCESS: CheckCircle,
  LOGIN_FAILURE: XCircle,
  USER_CREATED: Info,
  PASSWORD_RESET: AlertTriangle,
  SESSION_TERMINATED: Info,
};

const colors: Record<string, string> = {
  LOGIN_SUCCESS: 'text-green-500',
  LOGIN_FAILURE: 'text-red-500',
  USER_CREATED: 'text-cyan-500',
  PASSWORD_RESET: 'text-orange-500',
  SESSION_TERMINATED: 'text-gray-400',
};

export function RecentEvents() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">Recent Events</h3>
        <p className="text-xs text-gray-500">Audit log — last 24 hours</p>
      </div>
      <div className="space-y-3">
        {events.map((e, i) => {
          const Icon = icons[e.type] ?? Info;
          return (
            <div key={i} className="flex items-start gap-3">
              <Icon size={16} className={`mt-0.5 flex-shrink-0 ${colors[e.type]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-gray-700 truncate">{e.type.replace(/_/g, ' ')}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{e.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{e.user} · <span className="text-gray-400">{e.realm}</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
