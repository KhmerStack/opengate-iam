'use client';
import { useQuery } from '@tanstack/react-query';
import { roleApi } from '@/lib/api/roles';
import { realmApi } from '@/lib/api/realms';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { Shield } from 'lucide-react';
import { useState } from 'react';

export default function RolesPage() {
  const [realm, setRealm] = useState('master');
  const { data: realms } = useQuery({ queryKey: ['realms'], queryFn: realmApi.list });
  const { data, isLoading } = useQuery({
    queryKey: ['roles', realm],
    queryFn: () => roleApi.list(realm),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Roles" description="Permission roles across realms" />

      <div>
        <select
          value={realm}
          onChange={e => setRealm(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-400 bg-white"
        >
          {(realms ?? []).map(r => <option key={r.name} value={r.name}>{r.displayName || r.name}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-gray-200 h-24 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data ?? []).map(role => (
            <div key={role.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#0D1B2A' }}>
                  <Shield size={16} color="#00B4D8" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{role.name}</p>
                  {role.composite && <Badge variant="orange">Composite</Badge>}
                </div>
              </div>
              <p className="text-xs text-gray-500">{role.description || 'No description'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
