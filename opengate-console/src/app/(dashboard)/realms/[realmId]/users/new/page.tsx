'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api/users';
import { PageHeader } from '@/components/shared/PageHeader';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewUserPage({ params }: { params: { realmId: string } }) {
  const router = useRouter();
  const qc     = useQueryClient();

  const [form, setForm] = useState({
    username: '', email: '', firstName: '', lastName: '', password: '', enabled: true,
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => userApi.create(params.realmId, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      router.push(`/realms/${params.realmId}/users`);
    },
    onError: (e: any) => setError(e?.response?.data?.message ?? 'Failed to create user.'),
  });

  const field = (key: keyof typeof form, label: string, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-400"
        placeholder={label}
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="New User" description={`Add user to realm: ${params.realmId}`} />

      <form
        onSubmit={e => { e.preventDefault(); setError(''); mutation.mutate(); }}
        className="space-y-4 bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="grid grid-cols-2 gap-4">
          {field('firstName', 'First Name')}
          {field('lastName',  'Last Name')}
        </div>
        {field('username', 'Username *')}
        {field('email',    'Email',    'email')}
        {field('password', 'Password', 'password')}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="enabled"
            checked={form.enabled}
            onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="enabled" className="text-sm text-gray-700">Account enabled</label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-5 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style={{ background: '#00B4D8' }}
          >
            {mutation.isPending ? 'Creating…' : 'Create User'}
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
