'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/lib/api/clients';
import { PageHeader } from '@/components/shared/PageHeader';
import { ClientTable } from '@/components/clients/ClientTable';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function RealmClientsPage({ params }: { params: { realmId: string } }) {
  const qc = useQueryClient();
  const [secretMsg, setSecretMsg] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['clients', params.realmId],
    queryFn: () => clientApi.list(params.realmId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientApi.delete(params.realmId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });

  const regenMutation = useMutation({
    mutationFn: (clientId: string) => clientApi.regenerateSecret(params.realmId, clientId),
    onSuccess: (res) => setSecretMsg(`New secret: ${res.clientSecret}`),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="OAuth Clients"
        description={`Applications registered in realm: ${params.realmId}`}
        action={
          <Link href={`/realms/${params.realmId}/clients/new`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: '#00B4D8' }}>
            <Plus size={16} /> Register Client
          </Link>
        }
      />

      {secretMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800 font-mono">
          {secretMsg} <button className="ml-2 text-green-600 underline" onClick={() => setSecretMsg('')}>dismiss</button>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
          </div>
        </div>
      ) : (
        <ClientTable
          clients={data ?? []}
          onDelete={id => deleteMutation.mutate(id)}
          onRegenerate={clientId => regenMutation.mutate(clientId)}
        />
      )}
    </div>
  );
}
