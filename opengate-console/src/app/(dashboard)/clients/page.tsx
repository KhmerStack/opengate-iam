'use client';
import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/lib/api/clients';
import { realmApi } from '@/lib/api/realms';
import { PageHeader } from '@/components/shared/PageHeader';
import { ClientTable } from '@/components/clients/ClientTable';
import { useState } from 'react';

export default function ClientsPage() {
  const [realm, setRealm] = useState('master');
  const { data: realms } = useQuery({ queryKey: ['realms'], queryFn: realmApi.list });
  const { data, isLoading } = useQuery({
    queryKey: ['clients', realm],
    queryFn: () => clientApi.list(realm),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="OAuth Clients" description="Registered client applications" />
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
        <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
          </div>
        </div>
      ) : (
        <ClientTable clients={data ?? []} />
      )}
    </div>
  );
}
