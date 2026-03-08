'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/lib/api/clients';
import { PageHeader } from '@/components/shared/PageHeader';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewClientPage({ params }: { params: { realmId: string } }) {
  const router = useRouter();
  const qc     = useQueryClient();

  const [form, setForm] = useState({
    clientId: '', name: '', redirectUris: '', publicClient: false, pkceRequired: true,
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => clientApi.create(params.realmId, {
      ...form,
      redirectUris: form.redirectUris.split('\n').map(u => u.trim()).filter(Boolean),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      router.push(`/realms/${params.realmId}/clients`);
    },
    onError: (e: any) => setError(e?.response?.data?.message ?? 'Failed to create client.'),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Register Client" description={`New OAuth2 client in realm: ${params.realmId}`} />

      <form
        onSubmit={e => { e.preventDefault(); setError(''); mutation.mutate(); }}
        className="space-y-4 bg-white rounded-xl border border-gray-200 p-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client ID *</label>
          <input value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-cyan-400"
            placeholder="my-app" required />
          <p className="text-xs text-gray-400 mt-1">Unique identifier used in OAuth2 requests.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-400"
            placeholder="My Application" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URIs</label>
          <textarea value={form.redirectUris} onChange={e => setForm(f => ({ ...f, redirectUris: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-cyan-400"
            placeholder="http://localhost:3000/callback&#10;http://localhost:3001/callback" />
          <p className="text-xs text-gray-400 mt-1">One URI per line.</p>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.publicClient}
              onChange={e => setForm(f => ({ ...f, publicClient: e.target.checked }))}
              className="w-4 h-4 rounded" />
            Public client (no secret)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.pkceRequired}
              onChange={e => setForm(f => ({ ...f, pkceRequired: e.target.checked }))}
              className="w-4 h-4 rounded" />
            Require PKCE
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={mutation.isPending}
            className="px-5 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style={{ background: '#00B4D8' }}>
            {mutation.isPending ? 'Registering…' : 'Register Client'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
