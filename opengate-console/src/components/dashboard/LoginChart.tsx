'use client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { day: 'Mon', logins: 420, failures: 12 },
  { day: 'Tue', logins: 380, failures: 8 },
  { day: 'Wed', logins: 512, failures: 21 },
  { day: 'Thu', logins: 490, failures: 15 },
  { day: 'Fri', logins: 631, failures: 9 },
  { day: 'Sat', logins: 210, failures: 4 },
  { day: 'Sun', logins: 180, failures: 3 },
];

export function LoginChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">Login Activity</h3>
        <p className="text-xs text-gray-500">Logins vs failures — last 7 days</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="loginGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="failGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
          />
          <Area type="monotone" dataKey="logins" stroke="#00B4D8" strokeWidth={2} fill="url(#loginGrad)" name="Logins" />
          <Area type="monotone" dataKey="failures" stroke="#ef4444" strokeWidth={2} fill="url(#failGrad)" name="Failures" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
