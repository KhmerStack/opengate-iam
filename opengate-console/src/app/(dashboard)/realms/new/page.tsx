'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { realmApi } from '@/lib/api/realms';
import { PageHeader } from '@/components/shared/PageHeader';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, hyphens'),
  displayName: z.string().min(1, 'Required'),
  mfaRequired: z.boolean(),
  tokenLifespanSeconds: z.number().min(60).max(86400),
});

type FormData = z.infer<typeof schema>;

export default function NewRealmPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { mfaRequired: false, tokenLifespanSeconds: 300 },
  });

  const mutation = useMutation({
    mutationFn: realmApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['realms'] });
      router.push('/realms');
    },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="New Realm" description="Create a new IAM tenant" />

      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Realm Name *</label>
          <input
            {...register('name')}
            placeholder="my-realm"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-400 font-mono"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          <p className="text-xs text-gray-400 mt-1">Unique identifier. Cannot be changed after creation.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
          <input
            {...register('displayName')}
            placeholder="My Organization"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-400"
          />
          {errors.displayName && <p className="text-xs text-red-500 mt-1">{errors.displayName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Token Lifespan (seconds)</label>
          <input
            {...register('tokenLifespanSeconds', { valueAsNumber: true })}
            type="number"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-400"
          />
          <p className="text-xs text-gray-400 mt-1">Default: 300 seconds (5 minutes)</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            {...register('mfaRequired')}
            type="checkbox"
            id="mfa"
            className="w-4 h-4 rounded"
          />
          <label htmlFor="mfa" className="text-sm text-gray-700">Require MFA for all users</label>
        </div>

        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            Failed to create realm. Please try again.
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-5 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50 transition-opacity"
            style={{ background: '#00B4D8' }}
          >
            {mutation.isPending ? 'Creating...' : 'Create Realm'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
