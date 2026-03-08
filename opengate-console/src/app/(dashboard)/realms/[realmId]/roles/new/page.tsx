'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roleApi } from '@/lib/api/roles';
import { PageHeader } from '@/components/shared/PageHeader';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewRolePage({ params }: { params: { realmId: string } }) {
  const router = useRouter();
  const qc     = useQueryClient();

  const [form, setForm]   = useState({ name: '', description: '', composite: false });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => roleApi.create(params.realmId, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] });
      router.push(`/realms/${params.realmId}/roles`);
    },
    onError: (e: any) => setError(e?.response?.data?.message ?? 'Failed to create role.'),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="New Role" description={`Define a role in realm: ${params.realmId}`} />

      <form
        onSubmit={e => { e.preventDefault(); setError(''); mutation.mutate(); }}
        className="space-y-4 bg-white rounded-xl border border-gray-200 p-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-cyan-400"
            placeholder="admin" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-400"
            placeholder="Full administrative access" />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.composite}
            onChange={e => setForm(f => ({ ...f, composite: e.target.checked }))}
            className="w-4 h-4 rounded" />
          Composite role (inherits from other roles)
        </label>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={mutation.isPending}
            className="px-5 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style={{ background: '#00B4D8' }}>
            {mutation.isPending ? 'Creating…' : 'Create Role'}
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
